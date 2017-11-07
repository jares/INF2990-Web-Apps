import { Observable, Subscription } from 'rxjs/Rx';


export class Timer {
  isActive: boolean;
  sec: number;
  min: number;
  hours: number;
  time = "00:00";
  timer: Observable<any>;
  sub: Subscription;
  tick: number;

  constructor() {
    this.sec = 0;
    this.min = 0;
  }

  startTimer() {
    this.time = "";
    this.sec = 0;
    this.min = 0;
    this.timer = Observable.timer(0, 1000);
    this.sub = this.timer.subscribe(t => {
      this.time = this.timeToString(t);
      this.getTotalTick(t);
    });
    this.isActive = true;
  }

  getTotalTick(t: number) {
    this.tick = t;
  }
  stopTimer() {
    if (this.isActive) {
      this.sub.unsubscribe();
      this.isActive = false;
    }
  }

  timeToString(t: number): string {
    let time = "";
    this.sec = t % 60;
    this.min = Math.floor(t / 60);
    this.hours = Math.floor(t / 3600);

    if (this.hours > 0 && this.hours < 10) {
      time += "0" + String(this.hours) + ":";
    }
    else if (this.hours > 10) {
      time += String(this.hours) + ":";
    }

    if (this.min < 10) {
      time += "0";
    }
    time += String(this.min) + ":";

    if (this.sec < 10) {
      time += "0";
    }
    time += String(this.sec);
    return time;
  }

}
