import { Component, OnDestroy } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent implements OnDestroy {
  public path: string = '';
  public back: string = '';
  public title: string = '';
  public titleSubs$!: Subscription;

  constructor(private router: Router) {
    this.titleSubs$ = this.get_route_arguments().subscribe(({ data, path }) => {
      this.title = data.title;
      this.path = path;
      this.back = path.replace('/create', '').replace('/:id', '');
      document.title = 'Panel - ' + data.title;
    });
  }

  ngOnDestroy(): void {
    this.titleSubs$.unsubscribe();
  }

  get_route_arguments() {
    return this.router.events.pipe(
      filter((event) => event instanceof ActivationEnd),
      filter((event: any) => event.snapshot.firstChild === null),
      map((event: any) => event.snapshot.routeConfig)
    );
  }
}
