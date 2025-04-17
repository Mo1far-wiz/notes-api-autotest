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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const note_entity_1 = require("./entities/note.entity");
let NotesService = class NotesService {
    constructor(notesRepository) {
        this.notesRepository = notesRepository;
    }
    getAllNotes() {
        return __awaiter(this, void 0, void 0, function* () {
            const notes = yield this.notesRepository.find();
            return { items: notes };
        });
    }
    getNoteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield this.notesRepository.findOne({ where: { id } });
            if (!note) {
                throw new common_1.NotFoundException(`Note with ID ${id} not found`);
            }
            return note;
        });
    }
    createNote(createNoteDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const note = this.notesRepository.create({
                title: createNoteDto.title,
                content: createNoteDto.content || '',
            });
            return this.notesRepository.save(note);
        });
    }
    updateNote(id, updateNoteDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield this.getNoteById(id);
            if (updateNoteDto.title !== undefined) {
                note.title = updateNoteDto.title;
            }
            if (updateNoteDto.content !== undefined) {
                note.content = updateNoteDto.content;
            }
            return this.notesRepository.save(note);
        });
    }
    deleteNote(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield this.getNoteById(id);
            yield this.notesRepository.remove(note);
            return { success: true };
        });
    }
};
exports.NotesService = NotesService;
exports.NotesService = NotesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(note_entity_1.Note)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotesService);
