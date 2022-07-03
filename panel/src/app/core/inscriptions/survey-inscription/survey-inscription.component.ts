import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';

@Component({
  selector: 'app-survey-inscription',
  templateUrl: './survey-inscription.component.html',
})
export class SurveyInscriptionComponent implements OnInit {
  public my_data = false;
  public survey: any = {};
  public id: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => (this.id = id));
    this.init_data();
  }

  init_data() {
    this.customerService.read_survey(this.id).subscribe({
      next: (res) => {
        if (res.data) {
          this.survey = res.data;
          this.my_data = true;
        } else {
          this.my_data = false;
        }
      },
    });
  }
}
