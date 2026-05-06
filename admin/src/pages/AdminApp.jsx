import React, { useMemo, useState } from 'react';

const initialLocations = [
  { id: 'lx', name: 'Barbearia Central', address: 'Rua Garrett 32, Lisboa', hours: 'Seg-Sab 09:00-20:00', photo: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=900' },
  { id: 'pt', name: 'Studio Norte', address: 'Rua das Flores 88, Porto', hours: 'Ter-Dom 10:00-21:00', photo: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=900' },
];

const initialServices = [
  { id: 'normal', name: 'Corte normal', price: 18, duration: 30, active: true },
  { id: 'fade', name: 'Degradê', price: 22, duration: 40, active: true },
  { id: 'combo', name: 'Cabelo + Barba', price: 32, duration: 60, active: true },
  { id: 'beard', name: 'Barba à máquina', price: 12, duration: 20, active: true },
  { id: 'brow', name: 'Tratamento de sobrancelha', price: 8, duration: 15, active: true },
  { id: 'blade-brow', name: 'Sobrancelha à navalha', price: 10, duration: 15, active: true },
];

const initialBarbers = [
  { id: 'tiago', name: 'Tiago Mendes', location: 'Barbearia Central', availability: 'Seg-Sex 09:00-18:00', photo: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=400' },
  { id: 'mara', name: 'Mara Silva', location: 'Barbearia Central', availability: 'Ter-Sab 11:00-20:00', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400' },
  { id: 'rui', name: 'Rui Costa', location: 'Studio Norte', availability: 'Ter-Dom 10:00-19:00', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400' },
];

const appointments = [
  { id: 'a1', client: 'João Almeida', service: 'Degradê', barber: 'Tiago Mendes', location: 'Barbearia Central', date: '2026-05-13', hour: '16:30', status: 'confirmado' },
  { id: 'a2', client: 'Marta Reis', service: 'Cabelo + Barba', barber: 'Rui Costa', location: 'Studio Norte', date: '2026-05-14', hour: '11:00', status: 'pendente' },
  { id: 'a3', client: 'Nuno Vale', service: 'Corte normal', barber: 'Mara Silva', location: 'Barbearia Central', date: '2026-05-14', hour: '17:00', status: 'concluido' },
];

const customers = [
  { id: 'u1', name: 'João Almeida', visits: 14, spent: 312, loyalty: 'Prata' },
  { id: 'u2', name: 'Marta Reis', visits: 4, spent: 86, loyalty: 'Bronze' },
  { id: 'u3', name: 'Nuno Vale', visits: 23, spent: 518, loyalty: 'Ouro' },
];

export const AdminApp = () => {
  const [tab, setTab] = useState('agenda');
  const [services, setServices] = useState(initialServices);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '' });
  const revenue = useMemo(() => customers.reduce((sum, item) => sum + item.spent, 0), []);

  const addService = (event) => {
    event.preventDefault();
    if (!newService.name.trim()) return;
    setServices((items) => [...items, { id: crypto.randomUUID(), name: newService.name, price: Number(newService.price || 0), duration: Number(newService.duration || 30), active: true }]);
    setNewService({ name: '', price: '', duration: '' });
  };

  const toggleService = (id) => setServices((items) => items.map((item) => item.id === id ? { ...item, active: !item.active } : item));
  const removeService = (id) => setServices((items) => items.filter((item) => item.id !== id));

  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="brand">XB</div>
        <h1>Painel Admin</h1>
        {[
          ['agenda', 'Agenda'],
          ['locations', 'Localizações'],
          ['services', 'Serviços'],
          ['barbers', 'Barbeiros'],
          ['blocks', 'Bloqueios'],
          ['clients', 'Clientes'],
        ].map(([id, label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>)}
      </aside>

      <section className="content">
        <div className="topbar">
          <div>
            <p className="eyebrow">Barbearia/Cabeleireiro</p>
            <h2>Gestão operacional</h2>
          </div>
          <div className="stats">
            <strong>{appointments.length}</strong><span>agendamentos</span>
            <strong>{revenue}€</strong><span>receita clientes</span>
          </div>
        </div>

        {tab === 'agenda' && <Panel title="Todos os agendamentos">
          <div className="calendar-grid">
            {appointments.map((item) => <article key={item.id} className="appointment">
              <span>{item.date} · {item.hour}</span>
              <strong>{item.client}</strong>
              <p>{item.service} com {item.barber}</p>
              <em>{item.location} · {item.status}</em>
            </article>)}
          </div>
        </Panel>}

        {tab === 'locations' && <Panel title="Gerir localizações">
          <div className="cards-grid">{initialLocations.map((item) => <article className="media-card" key={item.id}>
            <img src={item.photo} alt="" />
            <h3>{item.name}</h3>
            <p>{item.address}</p>
            <p>{item.hours}</p>
          </article>)}</div>
        </Panel>}

        {tab === 'services' && <Panel title="Gerir serviços">
          <form className="inline-form" onSubmit={addService}>
            <input placeholder="Nome" value={newService.name} onChange={(event) => setNewService({ ...newService, name: event.target.value })} />
            <input placeholder="Preço" type="number" value={newService.price} onChange={(event) => setNewService({ ...newService, price: event.target.value })} />
            <input placeholder="Duração min" type="number" value={newService.duration} onChange={(event) => setNewService({ ...newService, duration: event.target.value })} />
            <button>Adicionar</button>
          </form>
          <DataTable rows={services.map((item) => [item.name, `${item.price}€`, `${item.duration} min`, item.active ? 'Ativo' : 'Inativo', <button onClick={() => toggleService(item.id)}>Alternar</button>, <button onClick={() => removeService(item.id)}>Remover</button>])} />
        </Panel>}

        {tab === 'barbers' && <Panel title="Gerir barbeiros e disponibilidade">
          <div className="cards-grid">{initialBarbers.map((item) => <article className="media-card" key={item.id}>
            <img src={item.photo} alt="" />
            <h3>{item.name}</h3>
            <p>{item.location}</p>
            <p>{item.availability}</p>
          </article>)}</div>
        </Panel>}

        {tab === 'blocks' && <Panel title="Bloquear horários ou folgas">
          <form className="inline-form">
            <input type="date" defaultValue="2026-05-20" />
            <input type="time" defaultValue="14:00" />
            <select defaultValue="tiago"><option>Tiago Mendes</option><option>Mara Silva</option><option>Rui Costa</option></select>
            <button type="button">Bloquear slot</button>
          </form>
          <p className="note">Ligar esta ação à tabela disponibilidade_barbeiro para impedir marcações nesses horários.</p>
        </Panel>}

        {tab === 'clients' && <Panel title="Clientes e histórico de visitas">
          <DataTable rows={customers.map((item) => [item.name, `${item.visits} visitas`, `${item.spent}€`, item.loyalty])} />
        </Panel>}
      </section>
    </main>
  );
};

function Panel({ title, children }) {
  return <section className="panel"><h2>{title}</h2>{children}</section>;
}

function DataTable({ rows }) {
  return <div className="table">{rows.map((row, index) => <div className="table-row" key={index}>{row.map((cell, cellIndex) => <span key={cellIndex}>{cell}</span>)}</div>)}</div>;
}
