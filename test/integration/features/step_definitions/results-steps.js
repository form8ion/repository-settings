import {Given} from '@cucumber/cucumber';
import any from '@travi/any';

Given('the scaffolder results do not include homepage', async function () {
  return undefined;
});

Given('the scaffolder results include homepage', async function () {
  this.homepage = any.url();
});

Given('the scaffolder results include tags', async function () {
  this.tags = any.listOf(any.word);
});

Given('the scaffolder results do not include tags', async function () {
  return undefined;
});
