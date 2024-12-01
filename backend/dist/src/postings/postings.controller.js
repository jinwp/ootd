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
exports.PostingsController = void 0;
const common_1 = require("@nestjs/common");
const postings_service_1 = require("./postings.service");
const platform_express_1 = require("@nestjs/platform-express");
const create_posting_dto_1 = require("./dto/create-posting.dto");
const update_posting_dto_1 = require("./dto/update-posting.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let PostingsController = class PostingsController {
    constructor(postingsService) {
        this.postingsService = postingsService;
    }
    async createPosting(createPostingDto, req, files) {
        console.log(createPostingDto);
        const user_id = req.user.user_id;
        return this.postingsService.create(createPostingDto, user_id, files);
    }
    async getAllPostingWithFilter(semester, minHeight, maxHeight, minWeight, maxWeight) {
        const parsedMinHeight = minHeight ? parseFloat(minHeight) : undefined;
        const parsedMaxHeight = maxHeight ? parseFloat(maxHeight) : undefined;
        const parsedMinWeight = minWeight ? parseFloat(minWeight) : undefined;
        const parsedMaxWeight = maxWeight ? parseFloat(maxWeight) : undefined;
        return this.postingsService.findAll(semester, parsedMinHeight, parsedMaxHeight, parsedMinWeight, parsedMaxWeight);
    }
    async findPostingsByUser(user_id) {
        return this.postingsService.findByUser(user_id);
    }
    async updatePosting(updatePostingDto, post_id, files, req) {
        const user_id = req.user.user_id;
        const post = await this.postingsService.findByPostId(post_id);
        if (!post || post.user_id !== user_id) {
            throw new common_1.ForbiddenException('You cannot update other people posting');
        }
        return this.postingsService.update(updatePostingDto, post_id, files);
    }
    async deletePosting(post_id, req) {
        const user_id = req.user.user_id;
        const post = await this.postingsService.findByPostId(post_id);
        if (!post || post.user_id !== user_id) {
            throw new common_1.ForbiddenException('You cannot update other people posting');
        }
        return this.postingsService.remove(post_id);
    }
};
exports.PostingsController = PostingsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_posting_dto_1.CreatePostingDto, Object, Array]),
    __metadata("design:returntype", Promise)
], PostingsController.prototype, "createPosting", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('semester')),
    __param(1, (0, common_1.Query)('minHeight')),
    __param(2, (0, common_1.Query)('maxHeight')),
    __param(3, (0, common_1.Query)('minWeight')),
    __param(4, (0, common_1.Query)('maxWeight')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], PostingsController.prototype, "getAllPostingWithFilter", null);
__decorate([
    (0, common_1.Get)(':user_id'),
    __param(0, (0, common_1.Param)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PostingsController.prototype, "findPostingsByUser", null);
__decorate([
    (0, common_1.Post)(':post_id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('post_id')),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_posting_dto_1.UpdatePostingDto, String, Array, Object]),
    __metadata("design:returntype", Promise)
], PostingsController.prototype, "updatePosting", null);
__decorate([
    (0, common_1.Delete)(':post_id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('post_id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PostingsController.prototype, "deletePosting", null);
exports.PostingsController = PostingsController = __decorate([
    (0, common_1.Controller)('postings'),
    __metadata("design:paramtypes", [postings_service_1.PostingsService])
], PostingsController);
//# sourceMappingURL=postings.controller.js.map