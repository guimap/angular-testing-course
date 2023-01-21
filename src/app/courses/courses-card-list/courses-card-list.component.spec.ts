import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CoursesCardListComponent} from './courses-card-list.component';
import {CoursesModule} from '../courses.module';
import {COURSES} from '../../../../server/db-data';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {sortCoursesBySeqNo} from '../home/sort-course-by-seq';
import {Course} from '../model/course';
import {setupCourses} from '../common/setup-test-data';




describe('CoursesCardListComponent', () => {
  let component: CoursesCardListComponent
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

     imports: [
      CoursesModule
     ],
     teardown: { destroyAfterEach: false }

    })
    .compileComponents()
    
    fixture = TestBed.createComponent(CoursesCardListComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
      
  })

  it("should create the component", () => {

   expect(component).toBeTruthy()

  });


  it("should display the course list", () => {
    component.courses = setupCourses();
    fixture.detectChanges();
    
    const cards = el.queryAll(By.css('.course-card'));
    expect(cards).toBeTruthy("Component doesnt exists");
    expect(cards.length).toBe(12, "Unexpected number of courses");


  });


  it("should display the first course", () => {
      const mockCourses = setupCourses()
      mockCourses[0].titles.description = 'Testing Test'
      component.courses = mockCourses;
      fixture.detectChanges();

      const course = component.courses[0];
      const card = el.query(By.css('.course-card:first-child'));
      const title = card.query(By.css('mat-card-title'));
      const image = card.query(By.css('img'));

      expect(card).toBeTruthy();
      expect(title.nativeElement.textContent).toBe(course.titles.description);
      expect(image.nativeElement.src).toBe(course.iconUrl);

  });


});


