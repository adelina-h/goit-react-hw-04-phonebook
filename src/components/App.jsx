import Notiflix from 'notiflix';
import { nanoid } from 'nanoid';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactListComponent } from './ContactList/ContactList';
import { useState, useEffect } from 'react';

export const App = () => {
  const [contacts, setContacts] = useState(() => {
    const savedContacts = localStorage.getItem('contact');
    if (savedContacts !== null) {
      return JSON.parse(savedContacts);
    } else {
      return [];
    }
  });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('contact', JSON.stringify(contacts));
  }, [contacts]);

  const addNumber = ({ name, number }) => {
    const contactWithSameName = contacts.find(
      contact => contact.name.toLowerCase() === name.toLowerCase()
    );

    const contactWithSameNumber = contacts.find(
      contact => contact.number === number
    );

    if (contactWithSameName && contactWithSameNumber) {
      Notiflix.Notify.failure(
        `The contact ${name} and the number ${number} is already added!`
      );
    } else if (contactWithSameName) {
      Notiflix.Notify.failure(`The contact ${name} is already existing!`);
    } else if (contactWithSameNumber) {
      Notiflix.Notify.failure(
        `The contact with the number ${number} is already existing!`
      );
    } else {
      const newContact = { id: nanoid(), name, number };
      setContacts(prevState => [...prevState, newContact]);
      Notiflix.Notify.success(`Contact ${name} was succesfully added!`);
    }
  };

  const filterContacts = event => {
    setFilter(event.target.value);
  };

  const handleDelete = id => {
    setContacts(prevState => prevState.filter(contact => contact.id !== id));
  };

  const filteredContacts = contacts.filter(
    contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase()) ||
      contact.number.includes(filter)
  );

  return (
    <div style={{ marginBottom: '50px' }}>
      <ContactForm onSubmit={addNumber} />
      <Filter value={filter} onChange={filterContacts} />
      <ContactListComponent
        contacts={filteredContacts}
        onDelete={handleDelete}
      />
    </div>
  );
};
