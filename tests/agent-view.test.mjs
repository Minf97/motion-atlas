import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import ts from 'typescript'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const require = createRequire(import.meta.url)
const reactUrl = new URL(`file://${require.resolve('react')}`).href
const jsxUrl = new URL(`file://${require.resolve('react/jsx-runtime')}`).href
const original = readFileSync(new URL('../components/agent-view.tsx', import.meta.url), 'utf8')
// 隔离服务与子面板
const source = original.replace(/^import[\s\S]*?from "[^"]+"\n/gm, '')
const setup = `
import React, { useState } from '${reactUrl}';
const Brain = () => null, CirclePlus = Brain, Database = Brain, LayoutDashboard = Brain,
PanelLeftClose = Brain, PanelLeftOpen = Brain, MessageSquare = Brain, Settings = Brain, Workflow = Brain, Wrench = Brain;
const SiteHeader = () => null;
const Button = ({children, ...props}) => <button {...props}>{children}</button>;
const agentSections = ['Overview','Loop','Memory','Tool','Database','Settings'];
const cn = (...parts) => parts.filter(Boolean).join(' ');
const useAgent = () => ({connection:'connected', workspace:{tools:[]}, newChat(){}});
const AgentOverview = () => <div data-testid="architecture"/>;
const AgentPanels = () => <div data-testid="settings"/>;
const AgentChat = ({hidden, english}) => <aside hidden={hidden} aria-label={english ? 'Agent chat' : 'Agent 对话'}><textarea aria-label={english ? 'Question' : '问题'}/></aside>;
`
const compiled = ts.transpileModule(setup + source, {compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(jsxUrl))
const { AgentView } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`)

test('initial workspace shows architecture and editable chat simultaneously', () => {
  const html = renderToStaticMarkup(React.createElement(AgentView))
  assert.match(html, /aria-label="Agent 对话"/)
  assert.match(html, /<textarea/)
  assert.match(html, /data-testid="architecture"/)
  assert.doesNotMatch(html, /data-testid="settings"|<aside hidden/)
  assert.match(html, /aria-current="page" title="总览"/)
})

test('English navigation exposes all six Waku workspace sections', () => {
  const html = renderToStaticMarkup(React.createElement(AgentView, {english:true}))
  for (const label of ['Overview', 'Loop', 'Memory', 'Tool', 'Database', 'Settings']) {
    assert.ok(html.includes(`>${label}</span>`), label)
  }
  assert.match(html, /aria-label="Question"/)
  assert.match(html, /lang="en"/)
})

// 防止连线误当图标
 test('architecture canvas overrides the global icon dimensions', () => {
  const css = readFileSync(new URL('../app/agent-styles/architecture.css', import.meta.url), 'utf8')
  const rule = css.match(/\.agent-page \.agent-diagram > svg\s*\{([^}]+)\}/)?.[1]
  assert.ok(rule, 'canvas selector must outrank .agent-page svg')
  assert.match(rule, /width:\s*100%/)
  assert.match(rule, /height:\s*100%/)
})

// 完成后停止流动
const architectureSource = readFileSync(new URL('../components/agent/architecture.tsx', import.meta.url), 'utf8').replace(/^import[\s\S]*?from "[^"]+"\n/gm, '')
const architectureSetup = `
import React, { useId } from '${reactUrl}';
const Check = () => null, Circle = Check, CircleAlert = Check, LoaderCircle = Check;
const cn = (...parts) => parts.filter(Boolean).join(' ');
const stageStates = (turn) => ({input:'completed',context:'completed',model:'completed',tools:'completed',observe:'completed',answer:turn.status});
`
const architectureCompiled = ts.transpileModule(architectureSetup + architectureSource, {compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replaceAll('"react/jsx-runtime"', JSON.stringify(jsxUrl))
const { Architecture } = await import(`data:text/javascript;base64,${Buffer.from(architectureCompiled).toString('base64')}`)
test('answer connector flows during execution and stops on completion', () => {
  for (const status of ['running', 'completed']) {
    const html = renderToStaticMarkup(React.createElement(Architecture, {turn:{status,events:[]},selected:'answer',onSelect(){},english:true}))
    assert.ok(html.includes(`class="agent-answer-edge" data-live="${status === 'running'}"`))
    assert.match(html, /aria-label="Answer/)
  }
})

test('architecture nodes show stage numbers and status labels', () => {
  const html = renderToStaticMarkup(React.createElement(Architecture, {turn:{status:'completed',events:[]},selected:'input',onSelect(){},english:true}))
  assert.match(html, /agent-node-index">01</)
  assert.match(html, /agent-node-index">06</)
  assert.ok(!html.includes('ERR'), 'completed stages must not show error label')
})
