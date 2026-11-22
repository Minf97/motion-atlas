import { technicalSkills } from "./resume-skills-technical.ts"
import { businessSkills } from "./resume-skills-business.ts"

export const resumeSkillGroups = [...technicalSkills, ...businessSkills]
export { skillSources, experienceSources } from "./resume-skill-sources.ts"
export { skillPreviews } from "./resume-skill-sources.ts"
export type { ResumeSkill, ResumeProductSkill, ResumeTextSkill, ResumeSkillGroup } from "./resume-skill-sources"
