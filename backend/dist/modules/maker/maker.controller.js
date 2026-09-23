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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakerController = void 0;
const common_1 = require("@nestjs/common");
const maker_service_1 = require("./maker.service");
const register_app_maker_dto_1 = require("./dto/register-app-maker.dto");
const login_app_maker_dto_1 = require("./dto/login-app-maker.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const current_maker_decorator_1 = require("../../common/decorators/current-maker.decorator");
let MakerController = class MakerController {
    makerService;
    constructor(makerService) {
        this.makerService = makerService;
    }
    async register(dto) {
        return this.makerService.register(dto);
    }
    async login(dto) {
        return this.makerService.login(dto);
    }
    async getProfile(makerId) {
        return this.makerService.getProfile(makerId);
    }
    async checkKey(email) {
        return this.makerService.checkKey(email);
    }
};
exports.MakerController = MakerController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, public_decorator_1.SkipAppKey)(),
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_app_maker_dto_1.RegisterAppMakerDto]),
    __metadata("design:returntype", Promise)
], MakerController.prototype, "register", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, public_decorator_1.SkipAppKey)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_app_maker_dto_1.LoginAppMakerDto]),
    __metadata("design:returntype", Promise)
], MakerController.prototype, "login", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('profile'),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MakerController.prototype, "getProfile", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, public_decorator_1.SkipAppKey)(),
    (0, common_1.Get)('check-key'),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MakerController.prototype, "checkKey", null);
exports.MakerController = MakerController = __decorate([
    (0, common_1.Controller)('api/v1/maker'),
    __metadata("design:paramtypes", [maker_service_1.MakerService])
], MakerController);
//# sourceMappingURL=maker.controller.js.map