import { Observable, Subscription } from 'rxjs/Rx';


export class Timer {
  isActive: boolean;
  time: string;
  min: number;
  sec: number;
  timer: Observable<any>;
  sub: Subscription;

  startTimer() {
    this.min = 4;
    this.sec = 59;
    this.timer = Observable.timer(0, 1000);
    this.sub = this.timer.subscribe(t => {
      this.updateTime();
    });
    this.isActive = true;
  }

  stopTimer() {
    this.sub.unsubscribe();
    this.isActive = false;
    this.time = "0:00";
  }

  updateTime() {
    this.time = "";

    if (--this.sec === -1) {
      this.time += String(--this.min) + ":59";
      this.sec = 59;
      if (this.min === -1) {
        this.stopTimer();
      }
    }
    else {
      this.time += String(this.min);
      if (this.sec < 10) {
        this.time += ":0" + String(this.sec);
        return;
      }
      this.time += ":" + String(this.sec);
    }
  }

}
