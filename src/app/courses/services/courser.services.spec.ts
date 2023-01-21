import { HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { CoursesService } from "./courses.service";

describe('CoursesServices', () => {
  let coursesServices: CoursesService,
    httpTestingController: HttpTestingController;
  beforeEach(() => {
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService
      ]
    })
    coursesServices = TestBed.inject<CoursesService>(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController)
  })
  it('should retrieve all courses', () => {
    coursesServices.findAllCourses()
      .subscribe(courses => {
        expect(courses).toBeTruthy('No courses returned');
        expect(courses.length).toBe(12);

        const course = courses.find(course => course.id === 12);
        expect(course.titles.description).toBe("Angular Testing Course");

      });

      const request = httpTestingController.expectOne('/api/courses');
      expect(request.request.method).toEqual("GET");
      request.flush({ payload: Object.values(COURSES) });

  });

  it('should find course by ID', () => {
    coursesServices.findCourseById(12)
      .subscribe(course => {
        expect(course).toBeTruthy('No courses returned');
        expect(course.id).toBe(12);

      });

      const request = httpTestingController.expectOne('/api/courses/12');
      expect(request.request.method).toEqual("GET");
      request.flush(COURSES[12]);
      
  });

  it('should save course data', () => {
    const changes: Partial<Course> = {
      titles: { description: 'Testing Course'}
    }
    coursesServices.saveCourse(12, changes)
      .subscribe(course => {
        expect(course.id).toBe(12)
      });

      const request = httpTestingController.expectOne('/api/courses/12');
      expect(request.request.method).toEqual("PUT");
      expect(request.request.body.titles.description).toBe(changes.titles.description)
      request.flush({
        ...COURSES[12],
        ...changes
      });
      
  });

  it('should give an error if save course fails', () => {
    const changes: Partial<Course> = {
      titles: { description: 'Testing Course'}
    }
    coursesServices.saveCourse(12, changes)
      .subscribe(course => {
        fail('the save course operation should fail')
        // expect(course.id).toBe(12)
      }, (error: HttpErrorResponse) => {
        expect(error.status).toBe(500)
      });

      const request = httpTestingController.expectOne('/api/courses/12');
      expect(request.request.method).toEqual("PUT");
      request.flush('Save course failed', { status: 500, statusText: 'Internal Server Error'});
    
  });
  
  it('should find a list of lessons', () => {
    coursesServices.findLessons(12)
    .subscribe(lessons => {
      expect(lessons).toBeTruthy();
      expect(lessons.length).toBe(3)
    })

    const req = httpTestingController.expectOne(req => req.url == '/api/lessons');
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('courseId')).toBe("12");
    expect(req.request.params.get('filter')).toBe("");
    expect(req.request.params.get('sortOrder')).toBe("asc");
    expect(req.request.params.get('pageNumber')).toBe("0");
    expect(req.request.params.get('pageSize')).toBe("3");

    req.flush({
      payload: findLessonsForCourse(12).slice(0, 3)
    })

  });

  afterEach(() => {
    httpTestingController.verify();
  })
})