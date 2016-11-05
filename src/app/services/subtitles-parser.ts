import {Injectable} from '@angular/core';

@Injectable()
export class SubtitlesParser {
    constructor() {}

    private ass(text: string) {
        let reAss = new RegExp(
            'Dialogue:\\s\\d,' +                 // get time and subtitle
            '(\\d+:\\d\\d:\\d\\d.\\d\\d),' +     // start time
            '(\\d+:\\d\\d:\\d\\d.\\d\\d),' +     // end time
            '([^,]*),' +                         // object
            '([^,]*),' +                         // actor
            '(?:[^,]*,){4}' +
            '(.*)$',                             // subtitle
            'i'
        );
        let reTime = /(\d+):(\d\d):(\d\d).(\d\d)/;
        let reStyle = /\{[^}]+\}/g;

        let getSeconds = function (timeStr) {
            let match = timeStr.match(reTime);
            return Math.round(
                parseInt(match[1], 10) * 60 * 60 * 1000 +
                    parseInt(match[2], 10) * 60 * 1000 +
                    parseInt(match[3], 10) * 1000 +
                    parseInt(match[4], 10) * 10
            ) / 1000;
        };

        let lines = text.split(/[\n\r]+/g);
        let captions = lines.map(function (line, index) {
            let match = line.match(reAss);
            if (!match) { return null; }
            return {
                id: index + 1,
                startTime: getSeconds(match[1]),
                endTime: getSeconds(match[2]),
                text: match[5].replace(reStyle, '').replace(/\\N/g, '\n'),
                voice: match[3] && match[4] ? match[3] + ' ' + match[4] : ''
            };
        }).filter(function (caption) {
            return caption != null;
        });

        return captions.length ? captions : null;
    }

    private srt(text: string) {
        let reTime = /(\d\d):(\d\d):(\d\d),(\d\d\d)/;

        if (!reTime.test(text)) {
            return null;
        }

        let getSeconds = function (timeStr) {
            let match = timeStr.match(reTime);
            return Math.round(
                parseInt(match[1], 10) * 60 * 60 * 1000 +
                parseInt(match[2], 10) * 60 * 1000 +
                parseInt(match[3], 10) * 1000 +
                parseInt(match[4], 10)
            ) / 1000;
        };

        let entries = text.split(/\n[\r\n]+/g);
        let captions = entries.map(function (entry) {
            let lines = entry.split(/\n+/g);
            if (lines.length < 3) { return null; }
            let timestamps = lines[1].split(/\s*-->\s*/);
            return {
                id: lines[0],
                startTime: getSeconds(timestamps[0]),
                endTime: getSeconds(timestamps[1]),
                text: lines.slice(2).join('\n')
            };
        }).filter(function (caption) {
            return caption != null;
        });

        return captions.length ? captions : null;
    }

    private formatVtt(captions: any[]) {
        let padWithZeros = (num, digits) => ('0000' + num).slice(-digits);

        let formatTime = function (seconds) {
            let date = new Date(2000, 0, 1, 0, 0, 0, seconds * 1000);
            return [
                padWithZeros(date.getHours(), 2),
                padWithZeros(date.getMinutes(), 2),
                padWithZeros(date.getSeconds(), 2) + '.' + padWithZeros(date.getMilliseconds(), 3)
            ].join(':');
        };

        let lines = captions.map(function (caption) {
            return [
                caption.id,
                formatTime(caption.startTime) + ' --> ' + formatTime(caption.endTime),
                (caption.voice ? '<v ' + caption.voice + '>' : '') + caption.text
            ].join('\n');
        });

        return 'WEBVTT\n\n' + lines.join('\n\n');
    }

    toVTT(text: string) {
        if (text.indexOf('WEBVTT') == 0) {
            return text;
        }

        let parsed = this.ass(text) || this.srt(text);
        if (parsed) {
            return this.formatVtt(parsed);
        }

        return text;
    }
}
