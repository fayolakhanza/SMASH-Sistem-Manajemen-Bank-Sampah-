import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const SKIP_APP_KEY = 'skipAppKey';
export const SkipAppKey = () => SetMetadata(SKIP_APP_KEY, true);
