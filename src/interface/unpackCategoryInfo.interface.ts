import { UnpackBoxInfo } from '../interface/unpackBoxInfo.interface';
export type UnpackCategoryInfo = Omit<UnpackBoxInfo, 'box'> & { contrabandPic: any };
