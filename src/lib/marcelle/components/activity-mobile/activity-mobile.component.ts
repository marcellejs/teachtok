import type { Dataset, DataStore } from '@marcellejs/core';
import { Component } from '@marcellejs/core';
import View from './activity-mobile.view.svelte';

export class ActivityMobile extends Component {
  title = 'activity chat';

  constructor(
    public dataset: Dataset<undefined, undefined>,
    public store: DataStore,
    public filterAction = null,
  ) {
    super();
  }

  mount(target) {
    const t = target || document.querySelector(`#${this.id}`);
    if (!t) return;
    this.destroy();
    this.$$.app = new View({
      target: t,
      props: {
        title: this.title,
        dataset: this.dataset,
        store: this.store,
        filterAction: this.filterAction,
      },
    });
  }
}
