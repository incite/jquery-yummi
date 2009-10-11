
load('/opt/local/lib/ruby/gems/1.8/gems/jspec-2.11.5/lib/jspec.js')
load('lib/yourlib.core.js')

JSpec
.exec('spec/spec.core.js')
.run({ formatter: JSpec.formatters.Terminal })
.report()