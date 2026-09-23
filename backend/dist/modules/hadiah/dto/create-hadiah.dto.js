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
exports.CreateHadiahDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateHadiahDto {
    namaHadiah;
    poinDibutuhkan;
    stok;
    kategori;
    foto;
}
exports.CreateHadiahDto = CreateHadiahDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nama hadiah harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama hadiah wajib diisi.' }),
    __metadata("design:type", String)
], CreateHadiahDto.prototype, "namaHadiah", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'poinDibutuhkan harus berupa angka.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'poinDibutuhkan wajib diisi.' }),
    __metadata("design:type", Number)
], CreateHadiahDto.prototype, "poinDibutuhkan", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)({ message: 'stok harus berupa bilangan bulat.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'stok wajib diisi.' }),
    __metadata("design:type", Number)
], CreateHadiahDto.prototype, "stok", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHadiahDto.prototype, "kategori", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHadiahDto.prototype, "foto", void 0);
//# sourceMappingURL=create-hadiah.dto.js.map