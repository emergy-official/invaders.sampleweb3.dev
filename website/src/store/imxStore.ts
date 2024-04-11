import { atom } from 'nanostores';

export const account = atom("");
export const userInventory:any = atom({spaceships:[], projectiles: []})
export const marketPlaceItems:any = atom([])
export const userBalance:any = atom(0)