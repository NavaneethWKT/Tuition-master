import axios, { AxiosInstance } from "axios";

type RequestMethods = "get" | "post" | "patch" | "put" | "delete";

class TuitionMasterApiClient {
  private readonly client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  private async makeRequest<T>({
    method,
    url,
    data,
  }: {
    method: RequestMethods;
    url: string;
    data?: any;
  }): Promise<T> {
    const response = await this.client.request({
      method,
      url,
      data,
    });
    return response.data as T;
  }

  // login api
  public async login(
    persona: "student" | "parent" | "teacher" | "school",
    credentials: { phone: string; password: string }
  ): Promise<any> {
    return this.makeRequest<any>({
      method: "post",
      url: `/auth/login/${persona}`,
      data: credentials,
    });
  }

  // School Admin APIs
  public async getSchoolDetails(schoolId: string): Promise<any> {
    return this.makeRequest<any>({
      method: "get",
      url: `/school-admin/schools/${schoolId}`,
    });
  }

  public async getSchoolClasses(schoolId: string): Promise<any> {
    return this.makeRequest<any>({
      method: "get",
      url: `/school-admin/schools/${schoolId}/classes`,
    });
  }

  public async getSchoolTeachers(schoolId: string): Promise<any> {
    return this.makeRequest<any>({
      method: "get",
      url: `/school-admin/schools/${schoolId}/teachers`,
    });
  }

  // register school
  public async registerSchool(data: any): Promise<any> {
    return this.makeRequest<any>({
      method: "post",
      url: "/school-admin/schools",
      data: data,
    });
  }

  // create teacher
  public async createTeacher(data: any): Promise<any> {
    return this.makeRequest<any>({
      method: "post",
      url: "/school-admin/teachers",
      data: data,
    });
  }

  // create class
  public async createClass(data: any): Promise<any> {
    return this.makeRequest<any>({
      method: "post",
      url: "/school-admin/classes",
      data: data,
    });
  }

  // Teacher APIs
  // get teacher classes
  public async getTeacherClasses(teacherId: string): Promise<any> {
    return this.makeRequest<any>({
      method: "get",
      url: `/teacher/${teacherId}/classes`,
    });
  }

  // get teacher materials
  public async getTeacherMaterials(teacherId: string): Promise<any> {
    return this.makeRequest<any>({
      method: "get",
      url: `/teacher/${teacherId}/materials`,
    });
  }

  // get teacher statistics
  public async getTeacherStatistics(teacherId: string): Promise<any> {
    return this.makeRequest<any>({
      method: "get",
      url: `/teacher/${teacherId}/statistics`,
    });
  }

  // get teacher subjects
  public async getTeacherSubjects(teacherId: string): Promise<any> {
    return this.makeRequest<any>({
      method: "get",
      url: `/teacher/${teacherId}/subjects`,
    });
  }

  // get class students
  public async getClassStudents(classId: string): Promise<any> {
    return this.makeRequest<any>({
      method: "get",
      url: `/teacher/classes/${classId}/students`,
    });
  }

  // create student
  public async createStudent(data: any): Promise<any> {
    return this.makeRequest<any>({
      method: "post",
      url: "/student/students",
      data: data,
    });
  }

  // create parent
  public async createParent(data: any): Promise<any> {
    return this.makeRequest<any>({
      method: "post",
      url: "/parent/parents",
      data: data,
    });
  }

  // Parent APIs
  // get parent student
  public async getParentStudent(parentId: string): Promise<any> {
    return this.makeRequest<any>({
      method: "get",
      url: `/parent/${parentId}/student`,
    });
  }

  // Student APIs
  // get student class materials
  public async getStudentClassMaterials(studentId: string): Promise<any> {
    return this.makeRequest<any>({
      method: "get",
      url: `/student/${studentId}/class-materials`,
    });
  }

  // get student revisions
  public async getStudentRevisions(studentId: string): Promise<any> {
    return this.makeRequest<any>({
      method: "get",
      url: `/revision/students/${studentId}/revisions`,
    });
  }

  // generate revision pointers
  public async generatePointers(studyMaterialId: string): Promise<any> {
    console.log("studyMaterialId", studyMaterialId);
    return this.makeRequest<any>({
      method: "post",
      url: "/revision/pointers",
      data: {
        study_material_id: studyMaterialId,
      },
    });
  }

  // save revision
  public async saveRevision(data: any): Promise<any> {
    console.log("data - save revision", JSON.stringify(data));
    return this.makeRequest<any>({
      method: "post",
      url: "/revision/revisions",
      data: data,
    });
  }

  // Document upload API
  public async uploadDocument(data: any): Promise<any> {
    return this.makeRequest<any>({
      method: "post",
      url: "/documents/upload",
      data: data,
    });
  }
  public async viewDocument(publicId: string): Promise<any> {
    return this.makeRequest<any>({
      method: "get",
      url: `/documents/url?public_id=${publicId}`,
    });
  }
}

const getEnvVar = (key: string, defaultValue: string): string => {
  try {
    const env = (import.meta as any).env;
    if (env && env[key]) {
      return env[key];
    }
  } catch {
    // Fallback
  }
  return defaultValue;
};

const API_BASE_URL = getEnvVar(
  "VITE_API_BASE_URL",
  "http://192.168.1.16:8000/api"
);

export default new TuitionMasterApiClient(API_BASE_URL);
