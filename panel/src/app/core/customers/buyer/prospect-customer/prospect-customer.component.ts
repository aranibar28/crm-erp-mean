import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProspectService } from 'src/app/services/prospect.service';

@Component({
  selector: 'app-prospect-customer',
  templateUrl: './prospect-customer.component.html',
})
export class ProspectCustomerComponent implements OnInit {
  public id = this.activatedRoute.snapshot.parent?.params['id'];
  public activities: Array<any> = [];
  public load_data = true;
  public load_btn = false;
  public p: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private prospectService: ProspectService
  ) {}

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this.prospectService.list_activities(this.id).subscribe({
      next: (res) => {
        this.activities = res.data;
        this.load_data = false;
        console.log(this.activities);
      },
    });
  }
}
