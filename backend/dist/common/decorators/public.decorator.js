"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipAppKey = exports.SKIP_APP_KEY = exports.Public = exports.IS_PUBLIC_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
exports.SKIP_APP_KEY = 'skipAppKey';
const SkipAppKey = () => (0, common_1.SetMetadata)(exports.SKIP_APP_KEY, true);
exports.SkipAppKey = SkipAppKey;
//# sourceMappingURL=public.decorator.js.map