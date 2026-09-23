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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const auth_service_1 = require("./auth.service");
const register_nasabah_dto_1 = require("./dto/register-nasabah.dto");
const register_admin_dto_1 = require("./dto/register-admin.dto");
const login_user_dto_1 = require("./dto/login-user.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
const current_maker_decorator_1 = require("../../common/decorators/current-maker.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const file_upload_util_1 = require("../../common/utils/file-upload.util");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async registerNasabah(appMakerId, dto, file, req) {
        let fotoUrl = null;
        if (file) {
            fotoUrl = (0, file_upload_util_1.getFileUrl)(req, file.filename) || null;
        }
        else if (dto.foto && typeof dto.foto === 'string' && dto.foto.trim() !== '') {
            fotoUrl = dto.foto.trim();
        }
        return this.authService.registerNasabah(appMakerId, dto, fotoUrl);
    }
    async registerAdmin(appMakerId, dto) {
        return this.authService.registerAdmin(appMakerId, dto);
    }
    async login(appMakerId, dto) {
        return this.authService.login(appMakerId, dto);
    }
    async getMe(userId) {
        return this.authService.getMe(userId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('nasabah/register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto', { storage: file_upload_util_1.multerStorage })),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, register_nasabah_dto_1.RegisterNasabahBankDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerNasabah", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('admin/register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, register_admin_dto_1.RegisterAdminBankDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "registerAdmin", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, current_maker_decorator_1.CurrentMaker)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/v1/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map