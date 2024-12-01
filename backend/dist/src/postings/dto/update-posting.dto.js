"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePostingDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_posting_dto_1 = require("./create-posting.dto");
class UpdatePostingDto extends (0, mapped_types_1.PartialType)(create_posting_dto_1.CreatePostingDto) {
}
exports.UpdatePostingDto = UpdatePostingDto;
//# sourceMappingURL=update-posting.dto.js.map