import { Component } from '@marcellejs/core';
import View from './custom-chart.view.svelte';

export class CustomChart extends Component {
  title: string;
  sorted: Array<Array<any>>;
  primary: string;

  constructor() {
    super();
    this.title = 'Predictions';
    this.sorted = [];
    this.primary = 'test';
  }

  // @ts-ignore
  updatePred(pred) {
    //here we also wanna sort them roughly
    // console.log("we got the predictions: ", JSON.stringify(pred))
    this.primary = pred['label'];
    // Convert the "confidences" object into an array of arrays
    this.sorted = Object.entries(pred['confidences'])
      // @ts-ignore
      .map(([key, value]) => [key, parseFloat(value.toFixed(5))]); // Round confidence to 5 decimal places

    // Sort the array based on confidence values
    this.sorted.sort((a, b) => b[1] - a[1]);

    // console.log(this.sorted);

    if (this.$$.app) {
      this.$$.app.$set({ primary: this.primary, sorted: this.sorted });
    }
  }

  mount(target?: HTMLElement): void {
    const t = target || document.querySelector(`#${this.id}`);
    if (!t) return;
    this.destroy();
    this.$$.app = new View({
      target: t,
      props: {
        title: this.title,
        sorted: this.sorted,
        primary: this.primary,
      },
    });
  }
}
