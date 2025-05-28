/**
 * @fileOverview Service for managing user data.
 */

/**
 * Represents a user in the system.
 */
export interface User {
  /**
   * Unique identifier for the user.
   */
  id: string;
  /**
   * The user's display name.
   */
  name: string;
  /**
   * The user's role ('teacher' or 'student').
   */
  role: 'teacher' | 'student';
  /**
   * An optional list of student names associated with a teacher.
   * Only present if the role is 'teacher'.
   */
  students?: string[];
  /**
   * An optional name of the teacher associated with a student.
   * Only present if the role is 'student'.
   */
  teacherName?: string;
  /**
   * An optional subject taught by the teacher.
   * Only present if the role is 'teacher'.
   */
  subject?: string;
}

// --- Mock Data ---
const mockUsers: User[] = [
  {
    id: 'user123',
    name: 'Алексей Петров',
    role: 'teacher',
    subject: 'Математика',
    students: ['Иван Иванов', 'Мария Сидорова'], 
  },
  {
    id: 'user456',
    name: 'Иван Иванов',
    role: 'student',
    teacherName: 'Алексей Петров', 
  },
  {
    id: 'user789',
    name: 'Мария Сидорова',
    role: 'student',
    teacherName: 'Алексей Петров', 
  },
  {
    id: 'userABC',
    name: 'Елена Васильева',
    role: 'teacher',
    subject: 'Физика',
    students: ['Петр Алексеев'], 
  },
  {
    id: 'userDEF',
    name: 'Петр Алексеев',
    role: 'student',
    teacherName: 'Елена Васильева', 
  },
  {
    id: 'userGHI',
    name: 'Ольга Павлова',
    role: 'student', 
    teacherName: 'Преподаватель не назначен',
  },
   {
    id: 'userJKL',
    name: 'Константин Смирнов',
    role: 'teacher',
    subject: 'Химия',
    students: [], 
  },
  {
    id: 'userMNO',
    name: 'Сергей Николаев',
    role: 'student',
    teacherName: 'Преподаватель не назначен',
  },
  {
    id: 'userPQR',
    name: 'Виктория Попова',
    role: 'teacher',
    subject: 'Информатика',
    students: [], 
  },
  {
    id: 'userSTU',
    name: 'Ирина Михайлова',
    role: 'teacher',
    subject: 'Биология',
    students: [],
  },
  {
    id: 'userVWX',
    name: 'Дмитрий Фёдоров',
    role: 'teacher',
    subject: 'История',
    students: [],
  },
  {
    id: 'userYZA',
    name: 'Анна Кузнецова',
    role: 'teacher',
    subject: 'Литература',
    students: [],
  },
  {
    id: 'userBCD',
    name: 'Максим Лебедев',
    role: 'student',
    teacherName: 'Преподаватель не назначен',
  }
];

let currentUserId: string = 'user456'; // Default to a student
let userIdCounter = mockUsers.length + 1000; // Start counter higher to avoid collision with simple IDs
// --- End Mock Data ---

// --- Relationship Caches ---
// teacherId -> array of student names
const teacherStudentsCache = new Map<string, string[]>();
// studentName -> teacherName
const studentTeacherCache = new Map<string, string>();
// --- End Relationship Caches ---

function generateNewUserId(role: 'student' | 'teacher'): string {
  return `user-${role.charAt(0)}-${Date.now()}-${userIdCounter++}`;
}

/**
 * Synchronizes relationship caches (studentTeacherCache, teacherStudentsCache)
 * and teacher.students lists in mockUsers based on the student.teacherName field in mockUsers.
 * student.teacherName is considered the primary source of truth for student-to-teacher assignment.
 * This function also normalizes user objects (e.g., students don't have .students list).
 */
function syncRelationshipCaches() {
  studentTeacherCache.clear();
  teacherStudentsCache.clear();

  // Pass 1: Normalize user objects and build studentTeacherCache from student.teacherName.
  for (const user of mockUsers) {
    if (user.role === 'student') {
      user.students = undefined; // Ensure students don't have a .students list
      user.subject = undefined;  // Ensure students don't have a .subject

      if (user.teacherName && user.teacherName !== 'Преподаватель не назначен') {
        const teacherExists = mockUsers.find(t => t.role === 'teacher' && t.name === user.teacherName);
        if (teacherExists) {
          studentTeacherCache.set(user.name, user.teacherName);
        } else {
          // If assigned teacher doesn't exist (name mismatch, deleted, etc.), mark as unassigned.
          user.teacherName = 'Преподаватель не назначен';
        }
      } else {
        // If teacherName is empty, null, or already "не назначен", ensure it's standardized.
        user.teacherName = 'Преподаватель не назначен';
      }
    } else if (user.role === 'teacher') {
      user.teacherName = undefined; // Ensure teachers don't have a .teacherName
      user.students = []; // Temporarily clear; will be repopulated in Pass 2.
                           // subject is inherent to teacher, leave as is or ensure default if needed.
      if(!user.subject) user.subject = "Не указан"; // Default subject if not set
    }
  }

  // Pass 2: Populate teacher.students in mockUsers and teacherStudentsCache based on studentTeacherCache.
  for (const teacher of mockUsers) {
    if (teacher.role === 'teacher') {
      const currentTeacherStudents: string[] = [];
      studentTeacherCache.forEach((assignedTeacherName, studentName) => {
        if (assignedTeacherName === teacher.name) {
          currentTeacherStudents.push(studentName);
        }
      });
      // Update the teacher's .students list in mockUsers directly. This is now derived.
      teacher.students = [...new Set(currentTeacherStudents)]; // Ensure unique names
      teacherStudentsCache.set(teacher.id, [...teacher.students]);
    }
  }
  // console.log('Caches and mockUsers synchronized.');
  // console.log('Student-Teacher Cache:', Object.fromEntries(studentTeacherCache));
  // console.log('Teacher-Students Cache:', Object.fromEntries(teacherStudentsCache));
  // console.log('Mock Users (relevant parts):', mockUsers.map(u => ({ id: u.id, name: u.name, role: u.role, teacherName: u.teacherName, students: u.students ? u.students.length : undefined, subject: u.subject })));
}

// Initial synchronization when the module loads
syncRelationshipCaches();


export async function getCurrentUser(): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  const user = mockUsers.find(u => u.id === currentUserId);

  if (!user) {
    console.error(`User with ID ${currentUserId} not found. Returning a default guest user.`);
    // Attempt to find first student or first teacher if currentUserId is invalid.
    let fallbackUser = mockUsers.find(u => u.role === 'student') || mockUsers.find(u => u.role === 'teacher');
    if (fallbackUser) {
        currentUserId = fallbackUser.id; // Set to a valid user for next time
        return { ...fallbackUser };
    }
    // If no users at all, return guest.
    return {
      id: 'guest-user',
      name: 'Гость',
      role: 'student',
      teacherName: 'Преподаватель не назначен',
    };
  }
  // The user object from mockUsers should already be normalized by syncRelationshipCaches.
  return { ...user }; // Return a copy
}

export async function updateUser(updatedData: Partial<Pick<User, 'name' | 'role'>>): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const userIndex = mockUsers.findIndex(u => u.id === currentUserId);
  if (userIndex === -1) {
    throw new Error("Current user not found for update.");
  }

  const userToUpdate = mockUsers[userIndex];
  const oldName = userToUpdate.name;
  const oldRole = userToUpdate.role;

  let nameChanged = false;
  if (updatedData.name && updatedData.name.trim() && updatedData.name !== userToUpdate.name) {
    userToUpdate.name = updatedData.name.trim();
    nameChanged = true;
  }

  let roleChanged = false;
  if (updatedData.role && updatedData.role !== userToUpdate.role) {
    userToUpdate.role = updatedData.role;
    roleChanged = true;
    if (userToUpdate.role === 'teacher' && !userToUpdate.subject) {
        userToUpdate.subject = "Не указан"; // Add default subject if became teacher
    }
  }

  // If a teacher's name changed, update student.teacherName references in mockUsers.
  if (nameChanged && oldRole === 'teacher') {
    for (const student of mockUsers) {
      if (student.role === 'student' && student.teacherName === oldName) {
        student.teacherName = userToUpdate.name; // Update student's record in mockUsers
      }
    }
  }
  // If a student's name changed, their student.teacherName field itself is still valid.
  // syncRelationshipCaches will rebuild studentTeacherCache using the new student name as key.

  // Role changes might implicitly change relationships, which syncRelationshipCaches will handle
  // by re-deriving everything from student.teacherName and current roles.
  // For example, if a teacher becomes a student, their old students' teacherName will no longer match,
  // effectively unassigning them from this user.

  syncRelationshipCaches(); // Rebuild all caches and normalize/derive fields in mockUsers.

  // Return the updated user by fetching them again (which uses the synced mockUsers).
  const updatedCurrentUser = mockUsers.find(u => u.id === currentUserId);
  if (!updatedCurrentUser) throw new Error("Failed to retrieve updated user."); // Should not happen
  return { ...updatedCurrentUser }; // Return a copy
}

export async function getStudentsForTeacher(teacherId: string): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  // teacherStudentsCache is authoritative after sync.
  return [...(teacherStudentsCache.get(teacherId) || [])];
}

export async function addStudentToTeacherList(studentNameRaw: string): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const currentTeacherUser = mockUsers.find(u => u.id === currentUserId);
  if (!currentTeacherUser || currentTeacherUser.role !== 'teacher') {
    throw new Error('Текущий пользователь не является преподавателем или не найден.');
  }

  const studentNameToAdd = studentNameRaw.trim();
  if (studentNameToAdd === '') {
    throw new Error('Имя студента не может быть пустым.');
  }

  let studentUser = mockUsers.find(u => u.name === studentNameToAdd);

  if (studentUser) { // User with this name already exists
    if (studentUser.role === 'teacher') {
      throw new Error(`Пользователь "${studentNameToAdd}" является преподавателем и не может быть добавлен как студент.`);
    }
    // If studentUser.role is 'student', we are re-assigning or confirming assignment.
    studentUser.teacherName = currentTeacherUser.name; // Update/set their teacher
  } else { // Student does not exist, create them
    const newStudentId = generateNewUserId('student');
    studentUser = {
      id: newStudentId,
      name: studentNameToAdd,
      role: 'student',
      teacherName: currentTeacherUser.name, // Assign to current teacher
    };
    mockUsers.push(studentUser);
  }
  
  syncRelationshipCaches(); // This will update all caches and normalize mockUsers.

  // Return the teacher's updated student list from the cache.
  return [...(teacherStudentsCache.get(currentTeacherUser.id) || [])];
}

export async function getTeachers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  // syncRelationshipCaches ensures teacher objects in mockUsers have correct .students lists.
  return mockUsers
    .filter(user => user.role === 'teacher')
    .map(teacher => ({ ...teacher })); // Return copies
}

export async function enrollStudentWithTeacher(studentUserId: string, teacherUserId: string): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const studentUserIndex = mockUsers.findIndex(u => u.id === studentUserId);
  const teacherUserIndex = mockUsers.findIndex(u => u.id === teacherUserId);

  if (studentUserIndex === -1) throw new Error("Студент не найден.");
  if (teacherUserIndex === -1) throw new Error("Преподаватель не найден.");

  const studentUser = mockUsers[studentUserIndex];
  const teacherUser = mockUsers[teacherUserIndex];

  if (studentUser.role !== 'student') throw new Error("Только студенты могут записываться к преподавателям.");
  if (teacherUser.role !== 'teacher') throw new Error("Можно записаться только к преподавателю.");

  // Update the student's teacherName directly in the mockUsers array.
  // This is the primary data point that syncRelationshipCaches will use.
  studentUser.teacherName = teacherUser.name;
  
  syncRelationshipCaches(); // Rebuild caches and normalize all related data in mockUsers.

  // Return the updated student user data from mockUsers (it's already synced).
  const enrolledStudent = mockUsers.find(u => u.id === studentUserId);
  if (!enrolledStudent) throw new Error("Failed to retrieve enrolled student details.");
  return { ...enrolledStudent }; // Return a copy
}
