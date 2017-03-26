﻿import {Component, Input, OnChanges, SimpleChange} from '@angular/core';
@Component({
    selector: 'version-child',
    template: `
    <h3>Version {{major}}.{{minor}}</h3>
    <h4>Change log:</h4>
    <ul>
      <li *ngFor="let change of changeLog">{{change}}</li>
    </ul>
  `
})
export class VersionChildComponent implements OnChanges {
    @Input() public major: number;
    @Input() public minor: number;
    public changeLog: string[] = [];
    public ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        let log: string[] = [];
        for (let propName in changes) {
            let changedProp = changes[propName];
            let from = JSON.stringify(changedProp.previousValue);
            let to = JSON.stringify(changedProp.currentValue);
            log.push(`${propName} changed from ${from} to ${to}`);
        }
        this.changeLog.push(log.join(', '));
    }
}