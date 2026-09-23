"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../prisma/prisma.service");
const public_decorator_1 = require("../decorators/public.decorator");
let AppKeyGuard = class AppKeyGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const skipAppKey = this.reflector.getAllAndOverride(public_decorator_1.SKIP_APP_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (skipAppKey) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const appKey = request.headers['x-app-key'];
        if (!appKey || typeof appKey !== 'string') {
            throw new common_1.UnauthorizedException('Header x-app-key wajib disertakan untuk mengakses endpoint ini.');
        }
        const appMaker = await this.prisma.appMaker.findUnique({
            where: { appKey },
        });
        if (!appMaker) {
            throw new common_1.UnauthorizedException('App Key tidak valid atau tidak ditemukan.');
        }
        request.appMaker = appMaker;
        return true;
    }
};
exports.AppKeyGuard = AppKeyGuard;
exports.AppKeyGuard = AppKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], AppKeyGuard);
//# sourceMappingURL=app-key.guard.js.map