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
exports.RegisterAdminBankDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterAdminBankDto {
    username;
    password;
    namaUnit;
    namaPengelola;
    telp;
}
exports.RegisterAdminBankDto = RegisterAdminBankDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Username harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Username wajib diisi.' }),
    __metadata("design:type", String)
], RegisterAdminBankDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Password harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password wajib diisi.' }),
    __metadata("design:type", String)
], RegisterAdminBankDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nama unit harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama unit wajib diisi.' }),
    __metadata("design:type", String)
], RegisterAdminBankDto.prototype, "namaUnit", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nama pengelola harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama pengelola wajib diisi.' }),
    __metadata("design:type", String)
], RegisterAdminBankDto.prototype, "namaPengelola", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nomor telepon harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor telepon wajib diisi.' }),
    __metadata("design:type", String)
], RegisterAdminBankDto.prototype, "telp", void 0);
//# sourceMappingURL=register-admin.dto.js.map