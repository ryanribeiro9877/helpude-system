import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  MessageCircle,
  Save,
  Eye,
  Image,
  Volume2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function MarketingConfig() {
  const [config, setConfig] = useState({
    rcs: {
      enabled: true,
      template: 'Olá {nome}! Você foi pré-aprovado para um crédito de {valor}. Entre em contato conosco para cuidar da sua saúde! 💚',
      imageUrl: '',
    },
    email: {
      enabled: true,
      subject: '🎉 Parabéns! Seu crédito foi aprovado',
      template: `Olá {nome},

Temos uma ótima notícia para você!

Você foi pré-aprovado para um crédito de {valor} para cuidar da sua saúde em nossa clínica.

Benefícios:
✅ Sem consulta ao SPC/Serasa
✅ Parcelas que cabem no seu bolso
✅ Liberação rápida

Entre em contato conosco e agende sua consulta!

Atenciosamente,
{clinica}`,
    },
    voiceAI: {
      enabled: false,
      script: 'Olá, aqui é da {clinica}. Estou ligando para informar que você foi pré-aprovado para um crédito de {valor}. Gostaria de saber mais sobre como agendar sua consulta?',
      tone: 'professional' as 'formal' | 'friendly' | 'professional',
    },
    whatsapp: {
      connected: false,
      defaultMessage: 'Olá {nome}! 😊 Sou da {clinica}. Você foi pré-aprovado para um crédito de {valor}. Posso te ajudar a agendar sua consulta?',
    },
  });

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  const handlePreview = (channel: string) => {
    toast.info(`Visualizando preview do ${channel}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">
            Automação de Marketing
          </h2>
          <p className="text-muted-foreground">
            Configure mensagens automáticas para clientes aprovados
          </p>
        </div>
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs defaultValue="rcs" className="space-y-6">
        <TabsList className="bg-white shadow-sm border p-1">
          <TabsTrigger value="rcs" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            RCS/SMS
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            E-mail
          </TabsTrigger>
          <TabsTrigger value="voice" className="gap-2">
            <Phone className="h-4 w-4" />
            Ligação IA
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </TabsTrigger>
        </TabsList>

        {/* RCS Tab */}
        <TabsContent value="rcs">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-helpude-purple-600" />
                      RCS / SMS Rich
                    </CardTitle>
                    <CardDescription>
                      Mensagem enviada automaticamente quando o crédito é aprovado
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="rcs-enabled">Ativo</Label>
                    <Switch
                      id="rcs-enabled"
                      checked={config.rcs.enabled}
                      onCheckedChange={(checked) =>
                        setConfig(prev => ({
                          ...prev,
                          rcs: { ...prev.rcs, enabled: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Editor */}
                  <div className="space-y-4">
                    <div>
                      <Label>Texto da Mensagem</Label>
                      <Textarea
                        value={config.rcs.template}
                        onChange={(e) =>
                          setConfig(prev => ({
                            ...prev,
                            rcs: { ...prev.rcs, template: e.target.value }
                          }))
                        }
                        className="min-h-[150px] mt-2"
                        placeholder="Digite sua mensagem..."
                      />
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                          {'{nome}'}
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                          {'{valor}'}
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                          {'{clinica}'}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label>Imagem (opcional)</Label>
                      <div className="mt-2 border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-helpude-purple-300 transition-colors cursor-pointer">
                        <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Arraste uma imagem ou clique para fazer upload
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG até 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  <div>
                    <Label>Preview</Label>
                    <div className="mt-2 bg-gray-100 rounded-2xl p-4">
                      <div className="bg-white rounded-xl shadow-sm max-w-[280px] mx-auto">
                        {config.rcs.imageUrl && (
                          <div className="h-32 bg-gradient-to-br from-helpude-purple-200 to-helpude-teal-200 rounded-t-xl" />
                        )}
                        <div className="p-4">
                          <p className="text-sm whitespace-pre-wrap">
                            {config.rcs.template
                              .replace('{nome}', 'Maria')
                              .replace('{valor}', 'R$ 15.000,00')
                              .replace('{clinica}', 'Clínica Saúde Total')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-helpude-purple-600" />
                      E-mail Marketing
                    </CardTitle>
                    <CardDescription>
                      E-mail enviado automaticamente para clientes aprovados
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="email-enabled">Ativo</Label>
                    <Switch
                      id="email-enabled"
                      checked={config.email.enabled}
                      onCheckedChange={(checked) =>
                        setConfig(prev => ({
                          ...prev,
                          email: { ...prev.email, enabled: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Assunto do E-mail</Label>
                  <Input
                    value={config.email.subject}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        email: { ...prev.email, subject: e.target.value }
                      }))
                    }
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Corpo do E-mail</Label>
                  <Textarea
                    value={config.email.template}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        email: { ...prev.email, template: e.target.value }
                      }))
                    }
                    className="min-h-[250px] mt-2 font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    {'{nome}'}
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    {'{valor}'}
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    {'{clinica}'}
                  </Badge>
                </div>

                <Button variant="outline" onClick={() => handlePreview('email')} className="gap-2">
                  <Eye className="h-4 w-4" />
                  Visualizar Preview
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Voice AI Tab */}
        <TabsContent value="voice">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-helpude-purple-600" />
                      Ligação com IA
                    </CardTitle>
                    <CardDescription>
                      Configure o comportamento da IA nas ligações automáticas
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="warning">Em Breve</Badge>
                    <Label htmlFor="voice-enabled">Ativo</Label>
                    <Switch
                      id="voice-enabled"
                      checked={config.voiceAI.enabled}
                      disabled
                      onCheckedChange={(checked) =>
                        setConfig(prev => ({
                          ...prev,
                          voiceAI: { ...prev.voiceAI, enabled: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 opacity-60">
                <div>
                  <Label>Script de Abertura</Label>
                  <Textarea
                    value={config.voiceAI.script}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        voiceAI: { ...prev.voiceAI, script: e.target.value }
                      }))
                    }
                    className="min-h-[100px] mt-2"
                    disabled
                  />
                </div>

                <div>
                  <Label>Tom da Voz</Label>
                  <div className="flex gap-3 mt-2">
                    {['formal', 'professional', 'friendly'].map((tone) => (
                      <Button
                        key={tone}
                        variant={config.voiceAI.tone === tone ? 'default' : 'outline'}
                        size="sm"
                        disabled
                        className="capitalize"
                      >
                        {tone === 'formal' && 'Formal'}
                        {tone === 'professional' && 'Profissional'}
                        {tone === 'friendly' && 'Amigável'}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button variant="outline" disabled className="gap-2">
                  <Volume2 className="h-4 w-4" />
                  Ouvir Preview
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* WhatsApp Tab */}
        <TabsContent value="whatsapp">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      WhatsApp da Clínica
                    </CardTitle>
                    <CardDescription>
                      Conecte seu WhatsApp para chamar clientes diretamente
                    </CardDescription>
                  </div>
                  {config.whatsapp.connected ? (
                    <Badge variant="success">Conectado</Badge>
                  ) : (
                    <Button variant="outline" className="gap-2 text-green-600 border-green-200 hover:bg-green-50">
                      <MessageCircle className="h-4 w-4" />
                      Conectar WhatsApp
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Mensagem Padrão</Label>
                  <Textarea
                    value={config.whatsapp.defaultMessage}
                    onChange={(e) =>
                      setConfig(prev => ({
                        ...prev,
                        whatsapp: { ...prev.whatsapp, defaultMessage: e.target.value }
                      }))
                    }
                    className="min-h-[100px] mt-2"
                    placeholder="Mensagem que será preenchida ao chamar cliente..."
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Esta mensagem será preenchida automaticamente ao clicar em "Chamar no WhatsApp" no pipeline
                  </p>
                </div>

                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    {'{nome}'}
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    {'{valor}'}
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    {'{clinica}'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
