import {animate, state, style, transition, trigger} from '@angular/animations';

export const progressBar = trigger('progress-bar', [
  state('before', style({'width': '{{beforePercent}}%'}), {params: {beforePercent: 0}}),
  state('after', style({'width': '{{afterPercent}}%'}), {params: {afterPercent: 100}}),
  transition('before => after', animate('{{fullTime}}s ease-in'), {params: {fullTime: 1}}),
  transition('after => before', animate('0ms ease-in'))
]);

export type ProgressBarStatus = 'after' | 'before';
