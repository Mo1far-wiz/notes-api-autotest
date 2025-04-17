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
const notes_controller_1 = require("./notes/notes.controller");
const notes_service_1 = require("./notes/notes.service");
const note_dto_1 = require("./notes/dto/note.dto");
const note_dto_2 = require("./notes/dto/note.dto");
describe('NotesController', () => {
    let controller;
    let service;
    // Sample test data
    const mockNote = {
        id: '1',
        title: 'Test Note',
        content: 'Test Content',
    };
    const mockNotes = {
        items: [
            mockNote,
            {
                id: '2',
                title: 'Another Note',
                content: 'More Content',
            },
        ],
    };
    // Create mock service with all the methods we'll call
    const mockNotesService = {
        getAllNotes: jest.fn(),
        getNoteById: jest.fn(),
        createNote: jest.fn(),
        updateNote: jest.fn(),
        deleteNote: jest.fn(),
    };
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create a NestJS testing module with our controller and mocked service
        const module = yield testing_1.Test.createTestingModule({
            controllers: [notes_controller_1.NotesController],
            providers: [
                {
                    provide: notes_service_1.NotesService,
                    useValue: mockNotesService,
                },
            ],
        }).compile();
        controller = module.get(notes_controller_1.NotesController);
        service = module.get(notes_service_1.NotesService);
        // Reset mock function calls before each test
        jest.clearAllMocks();
    }));
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
    describe('getAllNotes', () => {
        it('should return an array of notes', () => __awaiter(void 0, void 0, void 0, function* () {
            mockNotesService.getAllNotes.mockResolvedValue(mockNotes);
            const result = yield controller.getAllNotes();
            expect(service.getAllNotes).toHaveBeenCalled();
            expect(result).toEqual(mockNotes);
            expect(result.items.length).toBe(2);
        }));
    });
    describe('getNoteById', () => {
        it('should return a note by id', () => __awaiter(void 0, void 0, void 0, function* () {
            mockNotesService.getNoteById.mockResolvedValue(mockNote);
            const result = yield controller.getNoteById('1');
            expect(service.getNoteById).toHaveBeenCalledWith('1');
            expect(result).toEqual(mockNote);
        }));
    });
    describe('createNote', () => {
        it('should create a new note', () => __awaiter(void 0, void 0, void 0, function* () {
            const createNoteDto = new note_dto_1.CreateNoteDto();
            createNoteDto.title = 'New Note';
            createNoteDto.content = 'New Content';
            const newNote = {
                id: '3',
                title: createNoteDto.title,
                content: createNoteDto.content || '',
            };
            mockNotesService.createNote.mockResolvedValue(newNote);
            const result = yield controller.createNote(createNoteDto);
            expect(service.createNote).toHaveBeenCalledWith(createNoteDto);
            expect(result).toEqual(newNote);
        }));
    });
    describe('updateNote', () => {
        it('should update an existing note', () => __awaiter(void 0, void 0, void 0, function* () {
            const updateNoteDto = new note_dto_2.UpdateNoteDto();
            updateNoteDto.title = 'Updated Title';
            const updatedNote = Object.assign(Object.assign({}, mockNote), { title: 'Updated Title' });
            mockNotesService.updateNote.mockResolvedValue(updatedNote);
            const result = yield controller.updateNote('1', updateNoteDto);
            expect(service.updateNote).toHaveBeenCalledWith('1', updateNoteDto);
            expect(result).toEqual(updatedNote);
        }));
    });
    describe('deleteNote', () => {
        it('should delete a note and return success', () => __awaiter(void 0, void 0, void 0, function* () {
            mockNotesService.deleteNote.mockResolvedValue({ success: true });
            const result = yield controller.deleteNote('1');
            expect(service.deleteNote).toHaveBeenCalledWith('1');
            expect(result).toEqual({ success: true });
        }));
    });
});
