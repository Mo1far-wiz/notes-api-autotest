"use strict";
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
const testing_1 = require("@nestjs/testing");
const notes_service_1 = require("./notes.service");
const typeorm_1 = require("@nestjs/typeorm");
const note_entity_1 = require("./entities/note.entity");
const common_1 = require("@nestjs/common");
const note_dto_1 = require("./dto/note.dto");
describe('NotesService', () => {
    let service;
    let repository;
    // Sample test data
    const mockNote = {
        id: '1',
        title: 'Test Note',
        content: 'Test Content',
    };
    const mockNotes = [
        mockNote,
        {
            id: '2',
            title: 'Another Note',
            content: 'More Content',
        },
    ];
    // Create a mock repository with the methods we'll use
    const mockRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
    };
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a NestJS testing module with our service and mocked repository
        const module = yield testing_1.Test.createTestingModule({
            providers: [
                notes_service_1.NotesService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(note_entity_1.Note),
                    useValue: mockRepository,
                },
            ],
        }).compile();
        service = module.get(notes_service_1.NotesService);
        repository = module.get((0, typeorm_1.getRepositoryToken)(note_entity_1.Note));
        // Reset mock function calls before each test
        jest.clearAllMocks();
    }));
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    describe('getAllNotes', () => {
        it('should return all notes', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRepository.find.mockResolvedValue(mockNotes);
            const result = yield service.getAllNotes();
            expect(repository.find).toHaveBeenCalled();
            expect(result).toEqual({ items: mockNotes });
            expect(result.items.length).toBe(2);
        }));
    });
    describe('getNoteById', () => {
        it('should return a note by id', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRepository.findOne.mockResolvedValue(mockNote);
            const result = yield service.getNoteById('1');
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
            expect(result).toEqual(mockNote);
        }));
        it('should throw NotFoundException when note not found', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRepository.findOne.mockResolvedValue(null);
            yield expect(service.getNoteById('999')).rejects.toThrow(common_1.NotFoundException);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
        }));
    });
    describe('createNote', () => {
        it('should create and return a new note', () => __awaiter(void 0, void 0, void 0, function* () {
            const createNoteDto = new note_dto_1.CreateNoteDto();
            createNoteDto.title = 'New Note';
            createNoteDto.content = 'New Content';
            const newNote = {
                id: '3',
                title: createNoteDto.title,
                content: createNoteDto.content,
            };
            mockRepository.create.mockReturnValue(newNote);
            mockRepository.save.mockResolvedValue(newNote);
            const result = yield service.createNote(createNoteDto);
            expect(repository.create).toHaveBeenCalledWith({
                title: createNoteDto.title,
                content: createNoteDto.content,
            });
            expect(repository.save).toHaveBeenCalledWith(newNote);
            expect(result).toEqual(newNote);
        }));
        it('should set default empty content when content is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const createNoteDto = new note_dto_1.CreateNoteDto();
            createNoteDto.title = 'New Note';
            // content is not set
            const newNoteWithEmptyContent = {
                id: '3',
                title: 'New Note',
                content: '',
            };
            mockRepository.create.mockReturnValue(newNoteWithEmptyContent);
            mockRepository.save.mockResolvedValue(newNoteWithEmptyContent);
            const result = yield service.createNote(createNoteDto);
            expect(repository.create).toHaveBeenCalledWith({
                title: createNoteDto.title,
                content: '',
            });
            expect(result.content).toBe('');
        }));
    });
    describe('updateNote', () => {
        it('should update and return a note', () => __awaiter(void 0, void 0, void 0, function* () {
            const updateNoteDto = new note_dto_1.UpdateNoteDto();
            updateNoteDto.title = 'Updated Title';
            const updatedNote = Object.assign(Object.assign({}, mockNote), { title: 'Updated Title' });
            mockRepository.findOne.mockResolvedValue(mockNote);
            mockRepository.save.mockResolvedValue(updatedNote);
            const result = yield service.updateNote('1', updateNoteDto);
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
            expect(repository.save).toHaveBeenCalledWith(Object.assign(Object.assign({}, mockNote), { title: 'Updated Title' }));
            expect(result).toEqual(updatedNote);
        }));
        it('should only update provided fields', () => __awaiter(void 0, void 0, void 0, function* () {
            const updateNoteDto = new note_dto_1.UpdateNoteDto();
            updateNoteDto.content = 'Updated Content';
            const originalNote = Object.assign({}, mockNote);
            const updatedNote = Object.assign(Object.assign({}, mockNote), { content: 'Updated Content' });
            mockRepository.findOne.mockResolvedValue(originalNote);
            mockRepository.save.mockResolvedValue(updatedNote);
            const result = yield service.updateNote('1', updateNoteDto);
            expect(repository.save).toHaveBeenCalledWith(Object.assign(Object.assign({}, originalNote), { content: 'Updated Content' }));
            expect(result.content).toBe('Updated Content');
            expect(result.title).toBe(originalNote.title);
        }));
    });
    describe('deleteNote', () => {
        it('should delete a note and return success true', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRepository.findOne.mockResolvedValue(mockNote);
            mockRepository.remove.mockResolvedValue(mockNote);
            const result = yield service.deleteNote('1');
            expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
            expect(repository.remove).toHaveBeenCalledWith(mockNote);
            expect(result).toEqual({ success: true });
        }));
        it('should throw NotFoundException when trying to delete non-existent note', () => __awaiter(void 0, void 0, void 0, function* () {
            mockRepository.findOne.mockResolvedValue(null);
            yield expect(service.deleteNote('999')).rejects.toThrow(common_1.NotFoundException);
            expect(repository.remove).not.toHaveBeenCalled();
        }));
    });
});
