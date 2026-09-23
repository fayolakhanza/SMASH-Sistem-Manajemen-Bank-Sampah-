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
exports.CreateSetorSampahDto = exports.ItemSetorDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ItemSetorDto {
    kategoriSampahId;
    berat;
    beratKg;
    satuan;
}
exports.ItemSetorDto = ItemSetorDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'kategoriSampahId harus berupa string UUID.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'kategoriSampahId wajib diisi.' }),
    __metadata("design:type", String)
], ItemSetorDto.prototype, "kategoriSampahId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'berat harus berupa angka.' }),
    __metadata("design:type", Number)
], ItemSetorDto.prototype, "berat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'beratKg harus berupa angka.' }),
    __metadata("design:type", Number)
], ItemSetorDto.prototype, "beratKg", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'satuan harus berupa string (kg atau ton).' }),
    __metadata("design:type", String)
], ItemSetorDto.prototype, "satuan", void 0);
class CreateSetorSampahDto {
    tanggal;
    catatan;
    items;
    fotoBukti;
}
exports.CreateSetorSampahDto = CreateSetorSampahDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Tanggal harus berupa string ISO 8601.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tanggal wajib diisi.' }),
    __metadata("design:type", String)
], CreateSetorSampahDto.prototype, "tanggal", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Catatan harus berupa string.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Catatan wajib diisi.' }),
    __metadata("design:type", String)
], CreateSetorSampahDto.prototype, "catatan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed)) {
                    return parsed.map((item) => (0, class_transformer_1.plainToInstance)(ItemSetorDto, item));
                }
                return parsed;
            }
            catch {
                return value;
            }
        }
        else if (Array.isArray(value)) {
            return value.map((item) => (0, class_transformer_1.plainToInstance)(ItemSetorDto, item));
        }
        return value;
    }),
    (0, class_validator_1.IsArray)({ message: 'items harus berupa array item setor.' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ItemSetorDto),
    __metadata("design:type", Array)
], CreateSetorSampahDto.prototype, "items", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSetorSampahDto.prototype, "fotoBukti", void 0);
//# sourceMappingURL=create-setor.dto.js.map