import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Download,
  Eye,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress?: number;
  results?: {
    total: number;
    aprovados: number;
    rejeitados: number;
    pendentes: number;
  };
  uploadedAt: Date;
}

const mockFiles: UploadedFile[] = [
  {
    id: '1',
    name: 'clientes_janeiro.xlsx',
    size: '245 KB',
    status: 'completed',
    results: { total: 48, aprovados: 32, rejeitados: 12, pendentes: 4 },
    uploadedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'base_fevereiro.csv',
    size: '180 KB',
    status: 'completed',
    results: { total: 35, aprovados: 28, rejeitados: 5, pendentes: 2 },
    uploadedAt: new Date('2024-02-10'),
  },
];

export function ConsultasPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>(mockFiles);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const consultasRestantes = (user?.consultasLimite || 50) - (user?.consultasUsadas || 0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return ['xlsx', 'xls', 'csv'].includes(ext || '');
    });

    if (validFiles.length === 0) {
      toast.error('Formato inválido. Use arquivos .xlsx, .xls ou .csv');
      return;
    }

    setIsUploading(true);

    // Simular upload
    validFiles.forEach((file, index) => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + index,
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        status: 'uploading',
        progress: 0,
        uploadedAt: new Date(),
      };

      setFiles(prev => [newFile, ...prev]);

      // Simular progresso
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, progress, status: progress >= 100 ? 'processing' : 'uploading' }
              : f
          )
        );

        if (progress >= 100) {
          clearInterval(interval);
          
          // Simular processamento
          setTimeout(() => {
            setFiles(prev =>
              prev.map(f =>
                f.id === newFile.id
                  ? {
                      ...f,
                      status: 'completed',
                      results: {
                        total: Math.floor(Math.random() * 40) + 10,
                        aprovados: Math.floor(Math.random() * 30) + 5,
                        rejeitados: Math.floor(Math.random() * 10),
                        pendentes: Math.floor(Math.random() * 5),
                      },
                    }
                  : f
              )
            );
            setIsUploading(false);
            toast.success('Arquivo processado com sucesso!');
          }, 2000);
        }
      }, 200);
    });
  };

  const getStatusBadge = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Badge variant="default">Enviando...</Badge>;
      case 'processing':
        return <Badge variant="warning" className="gap-1"><Clock className="h-3 w-3" /> Processando</Badge>;
      case 'completed':
        return <Badge variant="success" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Concluído</Badge>;
      case 'error':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Erro</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Consultas em Lote
          </h1>
          <p className="text-muted-foreground">
            Faça upload de até {user?.level === 1 ? '50' : 'ilimitados'} registros por vez
          </p>
        </div>
        
        {/* Consultas Counter */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Consultas Disponíveis</p>
                <p className="text-2xl font-bold">
                  <span className="text-helpude-purple-600">{consultasRestantes}</span>
                  <span className="text-muted-foreground text-lg">/{user?.consultasLimite}</span>
                </p>
              </div>
              <Progress 
                value={(consultasRestantes / (user?.consultasLimite || 50)) * 100}
                className="w-24 h-3"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Warning */}
      {user?.level === 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">
                  Você está no Nível 1 - Acesso Inicial
                </p>
                <p className="text-sm text-amber-600">
                  Para consultas ilimitadas e crédito na conta da clínica, solicite upgrade para o Nível 2.
                </p>
              </div>
              <Button variant="outline" size="sm" className="text-amber-700 border-amber-300 hover:bg-amber-100">
                Solicitar Upgrade
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className={cn(
          "border-2 border-dashed transition-all duration-300",
          isDragging 
            ? "border-helpude-purple-500 bg-helpude-purple-50" 
            : "border-border hover:border-helpude-purple-300"
        )}>
          <CardContent className="p-8">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="text-center"
            >
              <div className={cn(
                "mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all",
                isDragging 
                  ? "bg-helpude-purple-500 text-white scale-110" 
                  : "bg-helpude-purple-100 text-helpude-purple-600"
              )}>
                <Upload className="h-8 w-8" />
              </div>

              <h3 className="text-lg font-semibold mb-2">
                {isDragging ? 'Solte o arquivo aqui' : 'Arraste sua base de clientes'}
              </h3>
              <p className="text-muted-foreground mb-4">
                ou clique para selecionar um arquivo
              </p>

              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                multiple
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="gap-2" disabled={isUploading} asChild>
                  <span>
                    <FileSpreadsheet className="h-4 w-4" />
                    Selecionar Arquivo
                  </span>
                </Button>
              </label>

              <p className="text-xs text-muted-foreground mt-4">
                Formatos aceitos: .xlsx, .xls, .csv • Máximo 50 registros por arquivo (Nível 1)
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Files List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Arquivos Processados</h2>
        
        {files.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum arquivo enviado ainda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* File Icon */}
                      <div className="p-3 rounded-xl bg-helpude-purple-100">
                        <FileSpreadsheet className="h-6 w-6 text-helpude-purple-600" />
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium truncate">{file.name}</p>
                          {getStatusBadge(file.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {file.size} • {file.uploadedAt.toLocaleDateString('pt-BR')}
                        </p>

                        {/* Progress Bar */}
                        {(file.status === 'uploading' || file.status === 'processing') && (
                          <div className="mt-2">
                            <Progress value={file.progress || 50} className="h-2" />
                          </div>
                        )}

                        {/* Results */}
                        {file.status === 'completed' && file.results && (
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm">
                              <span className="font-semibold text-green-600">{file.results.aprovados}</span>
                              <span className="text-muted-foreground"> aprovados</span>
                            </span>
                            <span className="text-sm">
                              <span className="font-semibold text-red-500">{file.results.rejeitados}</span>
                              <span className="text-muted-foreground"> rejeitados</span>
                            </span>
                            <span className="text-sm">
                              <span className="font-semibold text-amber-500">{file.results.pendentes}</span>
                              <span className="text-muted-foreground"> pendentes</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {file.status === 'completed' && (
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
