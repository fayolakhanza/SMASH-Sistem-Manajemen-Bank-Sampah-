"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentMaker = void 0;
const common_1 = require("@nestjs/common");
exports.CurrentMaker = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.appMaker) {
        return null;
    }
    return data ? request.appMaker[data] : request.appMaker;
});
//# sourceMappingURL=current-maker.decorator.js.map