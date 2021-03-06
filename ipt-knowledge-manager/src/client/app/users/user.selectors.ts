/*
 * Copyright (c) 2015-2017 IPT-Intellectual Products & Technologies (IPT).
 * All rights reserved.
 *
 * This file is licensed under terms of GNU GENERAL PUBLIC LICENSE Version 3
 * (GPL v3). The full text of GPL v3 license is providded in file named LICENSE,
 * residing in the root folder of this project.
 *
 */

import { RootState } from './user.module';
import { State } from './user.reducer';
import { createSelector } from 'reselect';

/**
 *User state specific selectors
 */
export const getEntities = (state: State) => state.entities;
export const getIds = (state: State) => state.ids;
export const getSelectedId = (state: State) => state.selectedUserId;
export const getLoading = (state: State) => state.loading;
export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});
export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});

/**
 * Root state selectors - select the `users` state.
 * Selectors are used with the `select` operator.
 *
 * ```ts
 * class ClientComponent {
 * 	constructor(state$: Observable<RootState>) {
 * 	  this.usersState$ = store$.select(getUsersState);
 * 	}
 * }
 * ```
 */
export const getUsersState = (state: RootState) => state.users;
export const getUsers = createSelector(getUsersState, getAll);
export const getUserEntities = createSelector(getUsersState, getEntities);
export const getUserIds = createSelector(getUsersState, getIds);
export const getSelectedUserId = createSelector(getUsersState, getSelectedId);
export const getSelectedUser = createSelector(getUsersState, getSelected);
export const getUsersLoading = createSelector(getUsersState, getLoading);
