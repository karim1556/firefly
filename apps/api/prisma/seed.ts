import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.incident.deleteMany();
  await prisma.session.deleteMany();
  await prisma.caseTimelineEvent.deleteMany();
  await prisma.case.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.student.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Firefly@123", 10);

  const [admin, counsellor, teacher, parentUser, studentUser] = await Promise.all([
    prisma.user.create({
      data: {
        fullName: "Aarav Admin",
        email: "admin@firefly.local",
        role: "ADMIN",
        passwordHash,
        schoolId: "school-001"
      }
    }),
    prisma.user.create({
      data: {
        fullName: "Celine Counsellor",
        email: "counsellor@firefly.local",
        role: "COUNSELLOR",
        passwordHash,
        schoolId: "school-001"
      }
    }),
    prisma.user.create({
      data: {
        fullName: "Tanya Teacher",
        email: "teacher@firefly.local",
        role: "TEACHER",
        passwordHash,
        schoolId: "school-001"
      }
    }),
    prisma.user.create({
      data: {
        fullName: "Priya Parent",
        email: "parent@firefly.local",
        role: "PARENT",
        passwordHash,
        schoolId: "school-001"
      }
    }),
    prisma.user.create({
      data: {
        fullName: "Sam Student",
        email: "student@firefly.local",
        role: "STUDENT",
        passwordHash,
        schoolId: "school-001"
      }
    })
  ]);

  const students = await Promise.all([
    prisma.student.create({
      data: {
        admissionNumber: "FF1001",
        firstName: "Sam",
        lastName: "Kapoor",
        grade: "8",
        classroom: "8A",
        tier: "TIER_2",
        status: "NEEDS_SUPPORT",
        riskScore: 62,
        counsellorId: counsellor.id
      }
    }),
    prisma.student.create({
      data: {
        admissionNumber: "FF1002",
        firstName: "Maya",
        lastName: "Rao",
        grade: "10",
        classroom: "10C",
        tier: "TIER_3",
        status: "NEEDS_INTERVENTION",
        riskScore: 84,
        counsellorId: counsellor.id
      }
    }),
    prisma.student.create({
      data: {
        admissionNumber: "FF1003",
        firstName: "Ishaan",
        lastName: "Gupta",
        grade: "7",
        classroom: "7B",
        tier: "TIER_1",
        status: "STABLE",
        riskScore: 24,
        counsellorId: counsellor.id
      }
    })
  ]);

  const [sam, maya] = students;

  await prisma.assessment.createMany({
    data: [
      { studentId: sam.id, score: 58, riskLevel: "MEDIUM", notes: "Moderate stress indicators" },
      { studentId: sam.id, score: 62, riskLevel: "HIGH", notes: "Increased absenteeism" },
      { studentId: maya.id, score: 78, riskLevel: "HIGH", notes: "Recent incident reported" },
      { studentId: maya.id, score: 84, riskLevel: "CRITICAL", notes: "Immediate intervention needed" }
    ]
  });

  const crisisCase = await prisma.case.create({
    data: {
      studentId: maya.id,
      openedById: admin.id,
      assignedCounsellorId: counsellor.id,
      title: "Crisis intervention and safety planning",
      summary: "Escalated risk from repeated distress signals and incident report.",
      tier: "TIER_3",
      type: "CRISIS",
      riskLevel: "CRITICAL",
      status: "IN_PROGRESS",
      timelineEvents: {
        create: [
          {
            createdById: counsellor.id,
            eventType: "case_opened",
            title: "Case Opened",
            description: "Case created after high-risk screening and teacher referral."
          },
          {
            createdById: counsellor.id,
            eventType: "parent_contacted",
            title: "Parent Contacted",
            description: "Parent notified and consent for intervention documented."
          }
        ]
      }
    }
  });

  await prisma.session.createMany({
    data: [
      {
        caseId: crisisCase.id,
        studentId: maya.id,
        counsellorId: counsellor.id,
        title: "Initial crisis counseling",
        notes: "Introduced coping strategies and emergency contacts.",
        scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        durationMins: 60,
        status: "COMPLETED"
      },
      {
        caseId: crisisCase.id,
        studentId: maya.id,
        counsellorId: counsellor.id,
        title: "Follow-up safety review",
        notes: "Monitor emotional state and reinforce school support plan.",
        scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        durationMins: 45,
        status: "SCHEDULED"
      }
    ]
  });

  await prisma.incident.create({
    data: {
      studentId: maya.id,
      caseId: crisisCase.id,
      reportedById: teacher.id,
      severity: "HIGH",
      incidentType: "Self-harm concern",
      description: "Teacher reported concerning statements and behavior in class.",
      actionTaken: "Escalated to counsellor and guardian informed within 30 minutes."
    }
  });

  console.log("Seed complete with test users:");
  console.log("admin@firefly.local / Firefly@123");
  console.log("counsellor@firefly.local / Firefly@123");
  console.log("teacher@firefly.local / Firefly@123");
  console.log("parent@firefly.local / Firefly@123");
  console.log("student@firefly.local / Firefly@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
