import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Note } from './entities/note.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateNoteDto, UpdateNoteDto } from './dto/note.dto';

describe('NotesService', () => {
  let service: NotesService;
  let repository: Repository<Note>;

  // Sample test data
  const mockNote: Note = {
    id: '1',
    title: 'Test Note',
    content: 'Test Content',
  };

  const mockNotes: Note[] = [
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

  beforeEach(async () => {
    // Create a NestJS testing module with our service and mocked repository
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotesService,
        {
          provide: getRepositoryToken(Note),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NotesService>(NotesService);
    repository = module.get<Repository<Note>>(getRepositoryToken(Note));

    // Reset mock function calls before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllNotes', () => {
    it('should return all notes', async () => {
      mockRepository.find.mockResolvedValue(mockNotes);
      const result = await service.getAllNotes();
      expect(repository.find).toHaveBeenCalled();
      expect(result).toEqual({ items: mockNotes });
      expect(result.items.length).toBe(2);
    });
  });

  describe('getNoteById', () => {
    it('should return a note by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockNote);
      const result = await service.getNoteById('1');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toEqual(mockNote);
    });

    it('should throw NotFoundException when note not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      await expect(service.getNoteById('999')).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '999' } });
    });
  });

  describe('createNote', () => {
    it('should create and return a new note', async () => {
      const createNoteDto = new CreateNoteDto();
      createNoteDto.title = 'New Note';
      createNoteDto.content = 'New Content';
      
      const newNote = {
        id: '3',
        title: createNoteDto.title,
        content: createNoteDto.content,
      };
      
      mockRepository.create.mockReturnValue(newNote);
      mockRepository.save.mockResolvedValue(newNote);
      
      const result = await service.createNote(createNoteDto);
      
      expect(repository.create).toHaveBeenCalledWith({
        title: createNoteDto.title,
        content: createNoteDto.content,
      });
      expect(repository.save).toHaveBeenCalledWith(newNote);
      expect(result).toEqual(newNote);
    });

    it('should set default empty content when content is not provided', async () => {
      const createNoteDto = new CreateNoteDto();
      createNoteDto.title = 'New Note';
      // content is not set
      
      const newNoteWithEmptyContent = {
        id: '3',
        title: 'New Note',
        content: '',
      };
      
      mockRepository.create.mockReturnValue(newNoteWithEmptyContent);
      mockRepository.save.mockResolvedValue(newNoteWithEmptyContent);
      
      const result = await service.createNote(createNoteDto);
      
      expect(repository.create).toHaveBeenCalledWith({
        title: createNoteDto.title,
        content: '',
      });
      
      expect(result.content).toBe('');
    });
  });

  describe('updateNote', () => {
    it('should update and return a note', async () => {
      const updateNoteDto = new UpdateNoteDto();
      updateNoteDto.title = 'Updated Title';
      
      const updatedNote = {
        ...mockNote,
        title: 'Updated Title',
      };
      
      mockRepository.findOne.mockResolvedValue(mockNote);
      mockRepository.save.mockResolvedValue(updatedNote);
      
      const result = await service.updateNote('1', updateNoteDto);
      
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.save).toHaveBeenCalledWith({
        ...mockNote,
        title: 'Updated Title',
      });
      
      expect(result).toEqual(updatedNote);
    });

    it('should only update provided fields', async () => {
      const updateNoteDto = new UpdateNoteDto();
      updateNoteDto.content = 'Updated Content';
      
      const originalNote = { ...mockNote };
      
      const updatedNote = {
        ...mockNote,
        content: 'Updated Content',
      };
      
      mockRepository.findOne.mockResolvedValue(originalNote);
      mockRepository.save.mockResolvedValue(updatedNote);
      
      const result = await service.updateNote('1', updateNoteDto);
      
      expect(repository.save).toHaveBeenCalledWith({
        ...originalNote,
        content: 'Updated Content',
      });
      
      expect(result.content).toBe('Updated Content');
      expect(result.title).toBe(originalNote.title);
    });
  });

  describe('deleteNote', () => {
    it('should delete a note and return success true', async () => {
      mockRepository.findOne.mockResolvedValue(mockNote);
      mockRepository.remove.mockResolvedValue(mockNote);
      
      const result = await service.deleteNote('1');
      
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(repository.remove).toHaveBeenCalledWith(mockNote);
      expect(result).toEqual({ success: true });
    });

    it('should throw NotFoundException when trying to delete non-existent note', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      
      await expect(service.deleteNote('999')).rejects.toThrow(NotFoundException);
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});