import { Component, OnInit } from '@angular/core';
import { IMiscellaneous } from '../miscellaneous';
import { MiscellaneousService } from '../miscellaneous.service';
import { ActivatedRoute, Router } from '@angular/router';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'app-miscellaneous',
  templateUrl: './miscellaneous.component.html',
  styleUrls: ['./miscellaneous.component.scss']
})
export class MiscellaneousComponent implements OnInit {

  miscellaneous: IMiscellaneous;
  miscellaneous_type: string;
  errorMessage = 'Loading...';

  constructor(private _miscellaneousService: MiscellaneousService, private _activatedRoute: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    const miscellaneousId: number = this._activatedRoute.snapshot.params['id'];
    this._miscellaneousService.getMiscellaneous(miscellaneousId)
      .retryWhen((err) => {
        return err.scan((retryCount) => {
          retryCount++;
          if (retryCount < 6) {
            return retryCount;
          } else {
            throw(err);
          }
        }, 0).delay(1000);
      })
      .subscribe((miscellaneousData) => {
        if (miscellaneousData === null) {
          this.errorMessage = 'Specified miscellaneous was not found.';
        } else {
          this.miscellaneous = miscellaneousData;
          this.errorMessage = '';
        }
      }, (error) => {
          if (error.status === 401) {
            this.errorMessage = 'You must log in first.';
          } else {
            this.errorMessage = 'Problem with the service. Please try again later.';
          }
          console.error(error);
      });
  }

  onBackButtonClick(): void {
    this._router.navigate(['/miscellaneous']);
  }
}
