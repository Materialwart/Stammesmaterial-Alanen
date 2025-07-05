import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

const initialItems = [
  { id: 1, name: 'Zelt Typ A', category: 'Zelt', total: 5, available: 3, location: 'K1', condition: 'gut', notes: '' },
  { id: 2, name: 'Heringe', category: 'Werkzeug', total: 100, available: 90, location: 'K2', condition: 'ok', notes: '' },
];

const users = {
  admin: { role: 'admin', password: 'admin123' },
  mitglied: { role: 'user', password: 'passwort' },
};

export default function InventoryApp() {
  const [items, setItems] = useState(initialItems);
  const [filterCategory, setFilterCategory] = useState('');
  const [search, setSearch] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [newItem, setNewItem] = useState({ name: '', category: '', total: 1, available: 1, location: '', condition: '', notes: '' });

  const filteredItems = items.filter(
    (item) =>
      (filterCategory === '' || item.category === filterCategory) &&
      (search === '' || item.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleLogin = (username, password) => {
    if (users[username] && users[username].password === password) {
      setCurrentUser({ username, role: users[username].role });
    } else {
      alert('Ungültige Zugangsdaten');
    }
  };

  const handleAddItem = () => {
    const id = Date.now();
    setItems([...items, { id, ...newItem }]);
    setNewItem({ name: '', category: '', total: 1, available: 1, location: '', condition: '', notes: '' });
  };

  const handleBorrow = (id) => {
    setItems(items.map(item => item.id === id && item.available > 0 ? { ...item, available: item.available - 1 } : item));
  };

  const handleReturn = (id) => {
    setItems(items.map(item => item.id === id && item.available < item.total ? { ...item, available: item.available + 1 } : item));
  };

  if (!currentUser) {
    let usernameInput = '', passwordInput = '';
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <Input placeholder="Benutzername" onChange={(e) => usernameInput = e.target.value} />
        <Input placeholder="Passwort" type="password" onChange={(e) => passwordInput = e.target.value} />
        <Button onClick={() => handleLogin(usernameInput, passwordInput)}>Einloggen</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Pfadfinder Inventur App</h1>
      <p className="text-sm">Angemeldet als: <strong>{currentUser.username}</strong> ({currentUser.role})</p>

      <div className="flex flex-wrap gap-4 items-center">
        <Input
          placeholder="Suche nach Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />

        <Select onValueChange={setFilterCategory} value={filterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Kategorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Alle</SelectItem>
            <SelectItem value="Zelt">Zelt</SelectItem>
            <SelectItem value="Werkzeug">Werkzeug</SelectItem>
            <SelectItem value="Deko">Deko</SelectItem>
          </SelectContent>
        </Select>

        {currentUser.role === 'admin' && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ Neues Material</Button>
            </DialogTrigger>
            <DialogContent className="space-y-2">
              <h2 className="text-lg font-semibold">Material hinzufügen</h2>
              <Input placeholder="Name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
              <Input placeholder="Kategorie" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} />
              <Input placeholder="Gesamtanzahl" type="number" value={newItem.total} onChange={(e) => setNewItem({ ...newItem, total: +e.target.value, available: +e.target.value })} />
              <Input placeholder="Lagerort" value={newItem.location} onChange={(e) => setNewItem({ ...newItem, location: e.target.value })} />
              <Input placeholder="Zustand" value={newItem.condition} onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })} />
              <Input placeholder="Notizen" value={newItem.notes} onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })} />
              <Button onClick={handleAddItem}>Speichern</Button>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4 space-y-2">
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p><strong>Kategorie:</strong> {item.category}</p>
              <p><strong>Verfügbar:</strong> {item.available} / {item.total}</p>
              <p><strong>Ort:</strong> {item.location}</p>
              <p><strong>Zustand:</strong> {item.condition}</p>
              {item.notes && <p><strong>Notizen:</strong> {item.notes}</p>}

              <div className="flex gap-2 pt-2">
                <Button onClick={() => handleBorrow(item.id)} disabled={item.available === 0}>Ausleihen</Button>
                <Button onClick={() => handleReturn(item.id)} disabled={item.available === item.total}>Zurückgeben</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
