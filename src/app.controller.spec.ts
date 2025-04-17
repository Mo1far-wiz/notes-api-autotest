import { Test, TestingModule } from '@nestjs/testing';
import { NotesController } from './notes/notes.controller';
import { NotesService } from './notes/notes.service';
import { INoteDto } from './notes/dto/note.dto';
import { HttpStatus } from '@nestjs/common';
import { CreateNoteDto } from './notes/dto/note.dto';
import { UpdateNoteDto } from './notes/dto/note.dto';

describe('NotesController', () => {
  let controller: NotesController;
  let service: NotesService;

  // Sample test data
  const mockNote: INoteDto = {
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

  beforeEach(async () => {
    // Create a NestJS testing module with our controller and mocked service
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService,
        },
      ],
    }).compile();

    controller = module.get<NotesController>(NotesController);
    service = module.get<NotesService>(NotesService);

    // Reset mock function calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllNotes', () => {
    it('should return an array of notes', async () => {
      mockNotesService.getAllNotes.mockResolvedValue(mockNotes);
      const result = await controller.getAllNotes();
      expect(service.getAllNotes).toHaveBeenCalled();
      expect(result).toEqual(mockNotes);
      expect(result.items.length).toBe(2);
    });
  });

  describe('getNoteById', () => {
    it('should return a note by id', async () => {
      mockNotesService.getNoteById.mockResolvedValue(mockNote);
      const result = await controller.getNoteById('1');
      expect(service.getNoteById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockNote);
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const createNoteDto = new CreateNoteDto();
      createNoteDto.title = 'New Note';
      createNoteDto.content = 'New Content';
      
      const newNote: INoteDto = {
        id: '3',
        title: createNoteDto.title,
        content: createNoteDto.content || '',
      };
      
      mockNotesService.createNote.mockResolvedValue(newNote);
      const result = await controller.createNote(createNoteDto);
      expect(service.createNote).toHaveBeenCalledWith(createNoteDto);
      expect(result).toEqual(newNote);
    });
  });

  describe('updateNote', () => {
    it('should update an existing note', async () => {
      const updateNoteDto = new UpdateNoteDto();
      updateNoteDto.title = 'Updated Title';
      
      const updatedNote: INoteDto = {
        ...mockNote,
        title: 'Updated Title',
      };
      
      mockNotesService.updateNote.mockResolvedValue(updatedNote);
      const result = await controller.updateNote('1', updateNoteDto);
      expect(service.updateNote).toHaveBeenCalledWith('1', updateNoteDto);
      expect(result).toEqual(updatedNote);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note and return success', async () => {
      mockNotesService.deleteNote.mockResolvedValue({ success: true });
      const result = await controller.deleteNote('1');
      expect(service.deleteNote).toHaveBeenCalledWith('1');
      expect(result).toEqual({ success: true });
    });
  });
});