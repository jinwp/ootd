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
exports.PostingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const process = require("node:process");
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
let PostingsService = class PostingsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
        this.s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    async uploadImagesToAWS(files) {
        if (!Array.isArray(files)) {
            files = [files];
        }
        const images = [];
        for (const file of files) {
            const fileName = `postings/${(0, uuid_1.v4)()}-${file.originalname}`;
            const uploadParams = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            };
            const command = new client_s3_1.PutObjectCommand(uploadParams);
            await this.s3Client.send(command);
            const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
            images.push({ imageUrl });
        }
        return images;
    }
    async create(createPostingDto, user_id, files) {
        const imageUrls = await this.uploadImagesToAWS(files);
        const { text, semester } = createPostingDto;
        const post = await this.prismaService.posting.create({
            data: {
                user_id,
                text,
                date_created: new Date(),
                semester,
                images: {
                    create: imageUrls,
                },
            },
            include: {
                images: true,
            },
        });
        return post;
    }
    async findAll(semester, minHeight, maxHeight, minWeight, maxWeight) {
        return this.prismaService.posting.findMany({
            where: {
                ...(semester && { semester: semester }),
                uploader: {
                    ...(minHeight && { height: { gte: minWeight } }),
                    ...(maxHeight && { height: { lte: maxHeight } }),
                    ...(minWeight && { weight: { gte: minWeight } }),
                    ...(maxWeight && { weight: { lte: maxWeight } }),
                },
            },
            orderBy: {
                date_created: 'desc',
            },
            include: {
                images: true,
                uploader: true,
            },
        });
    }
    async findByUser(user_id) {
        return this.prismaService.posting.findMany({
            where: {
                user_id: user_id,
            },
            orderBy: {
                date_created: 'desc',
            },
            include: {
                images: true,
                uploader: true,
            },
        });
    }
    async findByPostId(post_id) {
        return this.prismaService.posting.findUnique({
            where: {
                post_id: post_id,
            },
        });
    }
    async update(updatePostingDto, post_id, files) {
        const imageUrls = await this.uploadImagesToAWS(files);
        const { text, semester } = updatePostingDto;
        const currentPost = await this.prismaService.posting.findUnique({
            where: { post_id },
            include: { images: true },
        });
        const imageIdsToDelete = currentPost.images.map((image) => image.id);
        if (imageIdsToDelete.length > 0) {
            await this.prismaService.image.deleteMany({
                where: { id: { in: imageIdsToDelete } },
            });
        }
        const post = await this.prismaService.posting.update({
            where: {
                post_id: post_id,
            },
            data: {
                text: text,
                semester: semester,
                images: {
                    create: imageUrls,
                },
            },
            include: {
                images: true,
            },
        });
        return post;
    }
    async remove(post_id) {
        return this.prismaService.posting.delete({
            where: { post_id: post_id },
        });
    }
};
exports.PostingsService = PostingsService;
exports.PostingsService = PostingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostingsService);
//# sourceMappingURL=postings.service.js.map