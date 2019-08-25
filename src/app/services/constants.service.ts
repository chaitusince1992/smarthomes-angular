import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

  constructor() { }
  colorArray = ["#ffee66", "#fb4455", "#43ffff", "#afaafe", "#67f9bb", "#F2784B", "#6BB9F0", "#F62459", "#00B16A",
    "#6706d5", "#ECF0F1", "#FDE3A7",
    "#F22613", "#F1A9A0", "#DCC6E0", "#d605fd",
    "#19B5FE", "#F27935", "#C8F7C5", "#446CB3", "#26C281"];


  applBgColor(hex) {
    var c;
    if (hex === undefined)
      return 'transparent';
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.6)';
    }
    throw new Error('Bad Hex');
  }
}
