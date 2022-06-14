import { Injectable } from '@angular/core';
declare var $: any;

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor() {}

  menu: any[] = [
    {
      title: 'Actividades',
      path: 'prospect',
      class: 'btn btn-danger',
    },
    {
      title: 'Intereses',
      path: 'interest',
      class: 'btn btn-warning',
    },
    {
      title: 'LLamadas',
      path: 'call',
      class: 'btn btn-success',
    },
    {
      title: 'Correos',
      path: 'mail',
      class: 'btn btn-info',
    },
    {
      title: 'Tareas',
      path: 'task',
      class: 'btn btn-dark',
    },
  ];

  success(msg: string) {
    $.notify(msg, {
      type: 'success',
      spacing: 10,
      timer: 2000,
      placement: { from: 'top', align: 'right' },
      delay: 1000,
      animate: { enter: 'animated bounce', exit: 'animated bounce' },
    });
  }

  danger(msg: string) {
    $.notify(msg, {
      type: 'danger',
      spacing: 10,
      timer: 2000,
      placement: { from: 'top', align: 'right' },
      delay: 1000,
      animate: { enter: 'animated bounce', exit: 'animated bounce' },
    });
  }
}
