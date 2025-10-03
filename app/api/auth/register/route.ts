import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract all required fields from the JSON body
    const name = body.name;
    const lastName = body.lastName;
    const email = body.email;
    const identifier = body.identifier; // This is the phone number
    const password = body.password;
    const dob = body.dob;
    const referralCode = body.referralCode;

    // Use the working CSRF tokens from the curl test
    const csrfToken =
      "eyJpdiI6IjI2RUxuUVF6M2JyNUdieTNMTE1uRVE9PSIsInZhbHVlIjoibjAxMmJ3VCtlWlJ4S2VyZFBWVnAzUXNWZFVmZmNqMXBQZmpLT0l1WllkN3h3SzdTYVFyM0pGTzZEMHd3Q3hKMGIyN0hXYlBnV0RUcHVFdTRoM29Tak9LSG11amwwdWRpSzArR3VNZWdObEZMc3grQ0dXWUEwUWlVM3NJb3RFbTgiLCJtYWMiOiJmODc4MDk0MDUxZjRmYTY2NWJjNWUyNThjYThmMzE0MDczYzE3NWY3MTYwYmEwMTMyYjdhZmM5NmVjMWJlOGU2IiwidGFnIjoiIn0%3D";
    const sessionCookie =
      "eyJpdiI6IkUrb3Z6UkcwUy9PV3oycS9pcjBQVXc9PSIsInZhbHVlIjoiVlFtT3p1ajVJWFdSTm16NTltK3g5ZFgvVEVONnZ5U2p0VzdqcVg0dW8zd0g5b3dZK1pJUmVqbnVjUEhTOUxlS3ZUZm1VQ3p3RG1CVUlIZGNEQ0tKc1NQdWlWTGhyN2hhNHRMNWJkQkVUT25maDdqM3V4MVNXNC9IVDZSSHJVWW4iLCJtYWMiOiI4ZThhN2ZkN2Q4NWQ0NzJiOTMxZGRmNmE3YzY3NGJlZWE5ZTZmOGRlODdiNzhhYThhMzUxNjUwYmQ2MThkNzdmIiwidGFnIjoiIn0%3D";

    // Register with Roodito using FormData format with cookies
    const formData = new FormData();
    formData.append("name", name);
    formData.append("last_name", lastName);
    formData.append("middle_name", ""); // Add missing middle_name field
    formData.append("username", identifier);
    formData.append("email", email);
    formData.append("phone_number", identifier);
    formData.append("dob", dob || "1990-01-01");
    formData.append("password", password);
    formData.append("password_confirmation", password);
    if (referralCode) {
      formData.append("referral_code", referralCode);
    }

    const registerResponse = await fetch(
      "https://api.roodito.com/api/register",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Cookie: `XSRF-TOKEN=${csrfToken}; roodito_session=${sessionCookie}`,
        },
        body: formData,
      }
    );

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();

      return NextResponse.json({
        success: true,
        data: registerData,
      });
    } else {
      const errorText = await registerResponse.text();
      return NextResponse.json(
        { success: false, error: "Registration failed", details: errorText },
        { status: registerResponse.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Network error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
