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
exports.RegisterNasabahBankDto = void 0;
const class_validator_1 = require("class-validator");
class RegisterNasabahBankDto {
    username;
    password;
    namaNasabah;
    alamat;
    telp;
    foto;
}
exports.RegisterNasabahBankDto = RegisterNasabahBankDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Username harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Username wajib diisi.' }),
    __metadata("design:type", String)
], RegisterNasabahBankDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Password harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password wajib diisi.' }),
    __metadata("design:type", String)
], RegisterNasabahBankDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nama nasabah harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama nasabah wajib diisi.' }),
    __metadata("design:type", String)
], RegisterNasabahBankDto.prototype, "namaNasabah", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Alamat harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Alamat wajib diisi.' }),
    __metadata("design:type", String)
], RegisterNasabahBankDto.prototype, "alamat", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nomor telepon harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nomor telepon wajib diisi.' }),
    __metadata("design:type", String)
], RegisterNasabahBankDto.prototype, "telp", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterNasabahBankDto.prototype, "foto", void 0);
//# sourceMappingURL=register-nasabah.dto.js.map