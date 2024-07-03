import {Given} from '@cucumber/cucumber';
import any from '@travi/any';

Given('the scaffolder results do not include projectDetails', async function () {
  return undefined;
});

Given('the scaffolder results include projectDetails', async function () {
  this.homepage = any.url();
  this.projectDetails = {homepage: this.homepage};
});
