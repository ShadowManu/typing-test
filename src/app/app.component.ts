import { Component } from '@angular/core';

import { round, size, words } from 'lodash';
import { Subscription, interval } from 'rxjs';

const TIMER_RESOLUTION = 100; // milliseconds

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // tslint:disable-next-line:max-line-length
  sample = 'Lorem ipsum dolor sit amet';
  value = '';
  words = 0;
  time = 0;

  started: boolean;
  finished: boolean;
  intervalSub: Subscription;

  onInput(value: string) {
    // Finishing
    if (size(value) === size(this.sample)) {
      this.finished = true;
      this.intervalSub.unsubscribe();
      this.intervalSub = undefined;

    }

    // Starting
    if (this.isStarting(value)) {
      this.started = true;
      this.finished = false;
      this.intervalSub = interval(TIMER_RESOLUTION)
        .subscribe(num => this.time = num);
    }

    // Update state
    this.value = value;
    this.words = size(words(value));
  }

  onRestart() {
    this.started = false;
    this.finished = false;
    this.value = '';
    this.time = 0;
  }

  /** Utility function to determine if a new value should start the timer */
  isStarting(value: string) {
    return (
      size(this.value) === 0 // Input was empty
      && size(value) === 1 // Input is a singular character
      && this.time === 0 // time is fresh
    );
  }

  displayWPM() { return this.words / (this.seconds / 60); }

  /** Get timer in seconds */
  get seconds(): number { return this.time * TIMER_RESOLUTION / 1000; }
}
