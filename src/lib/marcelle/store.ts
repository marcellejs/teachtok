import { dataStore } from '@marcellejs/core';

// const backend_url = 'http://localhost:3030';
const backend_url = 'https://marcelle.lisn.upsaclay.fr/teachtok/api';

export const store = dataStore(backend_url);

export interface User {
  _id: string;
  email: string;
  name: string;
  avatar: string;
  team: string;
  role: string;
}
