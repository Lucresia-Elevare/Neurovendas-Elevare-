import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, FileText, BookOpen, Download, Trash2, Image, Video } from "lucide-react";
import { toast } from "sonner";

export default function GeradorMateriais() {
  const [activeTab, setActiveTab] = useState<"presentation" | "ebook" | "carousel" | "video">("presentation");
  
  // Estados para Apresentação
  const [presentationTheme, setPresentationTheme] = useState("");
  const [presentationTone, setPresentationTone] = useState<"profissional" | "casual" | "motivacional" | "educativo">("profissional");
  const [slideCount, setSlideCount] = useState(10);
  const [presentationAudience, setPresentationAudience] = useState("");
  
  // Estados para eBook
  const [ebookTheme, setEbookTheme] = useState("");
  const [ebookTone, setEbookTone] = useState<"profissional" | "casual" | "motivacional" | "educativo">("profissional");
  const [chapterCount, setChapterCount] = useState(5);
  const [ebookAudience, setEbookAudience] = useState("");
  
  // Estados para Carrossel (Canva)
  const [carouselTheme, setCarouselTheme] = useState("");
  const [carouselTone, setCarouselTone] = useState<"profissional" | "casual" | "motivacional" | "educativo">("profissional");
  const [carouselSlideCount, setCarouselSlideCount] = useState(10);
  const [carouselAudience, setCarouselAudience] = useState("");
  
  // Estados para Vídeo (Canva)
  const [videoTheme, setVideoTheme] = useState("");
  const [videoTone, setVideoTone] = useState<"profissional" | "casual" | "motivacional" | "educativo">("profissional");
  const [videoDuration, setVideoDuration] = useState(30);
  const [videoAudience, setVideoAudience] = useState("");
  
  // Mutations
  const generatePresentationMutation = trpc.materials.generatePresentation.useMutation({
    onSuccess: (data) => {
      toast.success("Apresentação gerada com sucesso!");
      setGeneratedContent(data.content);
      setGeneratedId(data.id);
      materialsQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao gerar apresentação: ${error.message}`);
    },
  });
  
  const generateEbookMutation = trpc.materials.generateEbook.useMutation({
    onSuccess: (data) => {
      toast.success("eBook gerado com sucesso!");
      setGeneratedContent(data.content);
      setGeneratedId(data.id);
      materialsQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao gerar eBook: ${error.message}`);
    },
  });
  
  const deleteMutation = trpc.materials.delete.useMutation({
    onSuccess: () => {
      toast.success("Material deletado!");
      materialsQuery.refetch();
    },
  });
  
  const exportPdfMutation = trpc.materials.exportToPdf.useMutation({
    onSuccess: (data) => {
      toast.success("PDF gerado com sucesso!");
      // Abrir PDF em nova aba
      window.open(data.url, "_blank");
      materialsQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao gerar PDF: ${error.message}`);
    },
  });
  
  // Queries Canva
  const canvaStatusQuery = trpc.canvaIntegration.getStatus.useQuery();
  const canvaDesignsQuery = trpc.canvaIntegration.listDesigns.useQuery();
  
  // Mutations Canva
  const canvaConnectMutation = trpc.canvaIntegration.connect.useMutation({
    onSuccess: (data) => {
      // Redirecionar para OAuth do Canva
      window.location.href = data.authUrl;
    },
    onError: (error) => {
      toast.error(`Erro ao conectar Canva: ${error.message}`);
    },
  });
  
  const generateCarouselMutation = trpc.canvaIntegration.generateCarousel.useMutation({
    onSuccess: (data) => {
      toast.success("Carrossel criado! Abrindo editor do Canva...");
      // Abrir editor do Canva em nova aba
      window.open(data.editUrl, "_blank");
      canvaDesignsQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao gerar carrossel: ${error.message}`);
    },
  });
  
  const generateVideoMutation = trpc.canvaIntegration.generateVideo.useMutation({
    onSuccess: (data) => {
      toast.success("Vídeo criado! Abrindo editor do Canva...");
      // Abrir editor do Canva em nova aba
      window.open(data.editUrl, "_blank");
      canvaDesignsQuery.refetch();
    },
    onError: (error) => {
      toast.error(`Erro ao gerar vídeo: ${error.message}`);
    },
  });
  
  // Query
  const materialsQuery = trpc.materials.list.useQuery();
  
  const [generatedContent, setGeneratedContent] = useState("");
  const [generatedId, setGeneratedId] = useState<number | null>(null);
  
  const handleGeneratePresentation = () => {
    if (!presentationTheme.trim()) {
      toast.error("Digite um tema para a apresentação");
      return;
    }
    
    generatePresentationMutation.mutate({
      theme: presentationTheme,
      tone: presentationTone,
      slideCount,
      audience: presentationAudience || undefined,
    });
  };
  
  const handleGenerateEbook = () => {
    if (!ebookTheme.trim()) {
      toast.error("Digite um tema para o eBook");
      return;
    }
    
    generateEbookMutation.mutate({
      theme: ebookTheme,
      tone: ebookTone,
      chapterCount,
      audience: ebookAudience || undefined,
    });
  };
  
  const handleDownloadMarkdown = () => {
    if (!generatedContent) return;
    
    const blob = new Blob([generatedContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab === "presentation" ? "apresentacao" : "ebook"}-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Markdown baixado!");
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerador de Materiais</h1>
        <p className="text-slate-600">Crie apresentações e eBooks profissionais com a LucresIA</p>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "presentation" ? "default" : "outline"}
          onClick={() => setActiveTab("presentation")}
          className="flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          Apresentação
        </Button>
        <Button
          variant={activeTab === "ebook" ? "default" : "outline"}
          onClick={() => setActiveTab("ebook")}
          className="flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          eBook
        </Button>
        <Button
          variant={activeTab === "carousel" ? "default" : "outline"}
          onClick={() => setActiveTab("carousel")}
          className="flex items-center gap-2"
        >
          <Image className="w-4 h-4" />
          Carrossel (Canva)
        </Button>
        <Button
          variant={activeTab === "video" ? "default" : "outline"}
          onClick={() => setActiveTab("video")}
          className="flex items-center gap-2"
        >
          <Video className="w-4 h-4" />
          Video (Canva)
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Painel Esquerdo - Formulário */}
        <Card className="p-6">
          {activeTab === "presentation" ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Criar Apresentação</h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Tema da Apresentação</Label>
                  <Input
                    value={presentationTheme}
                    onChange={(e) => setPresentationTheme(e.target.value)}
                    placeholder="Ex: Tratamentos Faciais para Verão"
                  />
                </div>
                
                <div>
                  <Label>Tom</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(["profissional", "casual", "motivacional", "educativo"] as const).map((tone) => (
                      <Button
                        key={tone}
                        variant={presentationTone === tone ? "default" : "outline"}
                        onClick={() => setPresentationTone(tone)}
                        size="sm"
                      >
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Número de Slides: {slideCount}</Label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={slideCount}
                    onChange={(e) => setSlideCount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>5</span>
                    <span>30</span>
                  </div>
                </div>
                
                <div>
                  <Label>Público-Alvo (Opcional)</Label>
                  <Input
                    value={presentationAudience}
                    onChange={(e) => setPresentationAudience(e.target.value)}
                    placeholder="Ex: Mulheres 25-45 anos"
                  />
                </div>
                
                <Button
                  onClick={handleGeneratePresentation}
                  disabled={generatePresentationMutation.isPending}
                  className="w-full"
                >
                  {generatePresentationMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "Gerar Apresentação"
                  )}
                </Button>
              </div>
            </>
          ) : activeTab === "ebook" ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Criar eBook</h2>
              
              <div className="space-y-4">
                <div>
                  <Label>Tema do eBook</Label>
                  <Input
                    value={ebookTheme}
                    onChange={(e) => setEbookTheme(e.target.value)}
                    placeholder="Ex: Guia Completo de Skincare"
                  />
                </div>
                
                <div>
                  <Label>Tom</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {(["profissional", "casual", "motivacional", "educativo"] as const).map((tone) => (
                      <Button
                        key={tone}
                        variant={ebookTone === tone ? "default" : "outline"}
                        onClick={() => setEbookTone(tone)}
                        size="sm"
                      >
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label>Número de Capítulos: {chapterCount}</Label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={chapterCount}
                    onChange={(e) => setChapterCount(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>3</span>
                    <span>10</span>
                  </div>
                </div>
                
                <div>
                  <Label>Público-Alvo (Opcional)</Label>
                  <Input
                    value={ebookAudience}
                    onChange={(e) => setEbookAudience(e.target.value)}
                    placeholder="Ex: Iniciantes em estética"
                  />
                </div>
                
                <Button
                  onClick={handleGenerateEbook}
                  disabled={generateEbookMutation.isPending}
                  className="w-full"
                >
                  {generateEbookMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "Gerar eBook"
                  )}
                </Button>
              </div>
            </>
          ) : activeTab === "carousel" ? (
            <>
              <h2 className="text-xl font-semibold mb-4">Criar Carrossel (Canva)</h2>
              
              {!canvaStatusQuery.data?.connected ? (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800 mb-4">Conecte sua conta Canva para criar carrosséis profissionais</p>
                    <Button
                      onClick={() => canvaConnectMutation.mutate()}
                      disabled={canvaConnectMutation.isPending}
                      className="w-full"
                    >
                      {canvaConnectMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Conectando...
                        </>
                      ) : (
                        "Conectar Canva"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-green-800">Canva conectado com sucesso!</p>
                  </div>
                  
                  <div>
                    <Label>Tema do Carrossel</Label>
                    <Input
                      value={carouselTheme}
                      onChange={(e) => setCarouselTheme(e.target.value)}
                      placeholder="Ex: Dicas de Maquiagem para Festas"
                    />
                  </div>
                  
                  <div>
                    <Label>Tom</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {(["profissional", "casual", "motivacional", "educativo"] as const).map((tone) => (
                        <Button
                          key={tone}
                          variant={carouselTone === tone ? "default" : "outline"}
                          onClick={() => setCarouselTone(tone)}
                          size="sm"
                        >
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Número de Slides: {carouselSlideCount}</Label>
                    <input
                      type="range"
                      min="5"
                      max="15"
                      value={carouselSlideCount}
                      onChange={(e) => setCarouselSlideCount(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>5</span>
                      <span>15</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Público-Alvo (Opcional)</Label>
                    <Input
                      value={carouselAudience}
                      onChange={(e) => setCarouselAudience(e.target.value)}
                      placeholder="Ex: Mulheres 20-35 anos"
                    />
                  </div>
                  
                  <Button
                    onClick={() => {
                      if (!carouselTheme.trim()) {
                        toast.error("Digite um tema para o carrossel");
                        return;
                      }
                      generateCarouselMutation.mutate({
                        theme: carouselTheme,
                        tone: carouselTone,
                        slideCount: carouselSlideCount,
                        audience: carouselAudience || undefined,
                      });
                    }}
                    disabled={generateCarouselMutation.isPending}
                    className="w-full"
                  >
                    {generateCarouselMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando no Canva...
                      </>
                    ) : (
                      "Criar Carrossel"
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4">Criar Vídeo (Canva)</h2>
              
              {!canvaStatusQuery.data?.connected ? (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-800 mb-4">Conecte sua conta Canva para criar vídeos profissionais</p>
                    <Button
                      onClick={() => canvaConnectMutation.mutate()}
                      disabled={canvaConnectMutation.isPending}
                      className="w-full"
                    >
                      {canvaConnectMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Conectando...
                        </>
                      ) : (
                        "Conectar Canva"
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-green-800">Canva conectado com sucesso!</p>
                  </div>
                  
                  <div>
                    <Label>Tema do Vídeo</Label>
                    <Input
                      value={videoTheme}
                      onChange={(e) => setVideoTheme(e.target.value)}
                      placeholder="Ex: Rotina de Skincare Noturna"
                    />
                  </div>
                  
                  <div>
                    <Label>Tom</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {(["profissional", "casual", "motivacional", "educativo"] as const).map((tone) => (
                        <Button
                          key={tone}
                          variant={videoTone === tone ? "default" : "outline"}
                          onClick={() => setVideoTone(tone)}
                          size="sm"
                        >
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Duração: {videoDuration}s</Label>
                    <input
                      type="range"
                      min="15"
                      max="60"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>15s</span>
                      <span>60s</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Público-Alvo (Opcional)</Label>
                    <Input
                      value={videoAudience}
                      onChange={(e) => setVideoAudience(e.target.value)}
                      placeholder="Ex: Mulheres 25-40 anos"
                    />
                  </div>
                  
                  <Button
                    onClick={() => {
                      if (!videoTheme.trim()) {
                        toast.error("Digite um tema para o vídeo");
                        return;
                      }
                      generateVideoMutation.mutate({
                        theme: videoTheme,
                        tone: videoTone,
                        duration: videoDuration,
                        audience: videoAudience || undefined,
                      });
                    }}
                    disabled={generateVideoMutation.isPending}
                    className="w-full"
                  >
                    {generateVideoMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Criando no Canva...
                      </>
                    ) : (
                      "Criar Vídeo"
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p>Selecione uma opção acima</p>
            </div>
          )}
        </Card>
        
        {/* Painel Direito - Preview */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            {generatedContent && generatedId && (
              <div className="flex gap-2">
                <Button
                  onClick={handleDownloadMarkdown}
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Markdown
                </Button>
                <Button
                  onClick={() => exportPdfMutation.mutate({ id: generatedId, format: "pdf" })}
                  disabled={exportPdfMutation.isPending}
                  size="sm"
                >
                  {exportPdfMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Exportar PDF
                </Button>
              </div>
            )}
          </div>
          
          {generatedContent ? (
            <div className="prose prose-sm max-w-none bg-slate-50 p-4 rounded-lg max-h-[600px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[600px] text-slate-400">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Preencha o formulário e gere seu material</p>
              </div>
            </div>
          )}
        </Card>
      </div>
      
      {/* Galeria de Materiais */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Materiais Gerados</h2>
        
        {materialsQuery.isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : materialsQuery.data && materialsQuery.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materialsQuery.data.map((material) => (
              <Card key={material.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {material.type === "presentation" ? (
                      <FileText className="w-5 h-5 text-primary" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-primary" />
                    )}
                    <h3 className="font-semibold text-sm">{material.title}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate({ id: material.id })}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                
                <div className="text-xs text-slate-600 space-y-1">
                  <p>Tom: {material.tone}</p>
                  <p>
                    {material.type === "presentation"
                      ? `${material.slideCount} slides`
                      : `${material.chapterCount} capítulos`}
                  </p>
                  <p className="text-slate-400">
                    {new Date(material.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => {
                    setGeneratedContent(material.content);
                    setGeneratedId(material.id);
                    setActiveTab(material.type);
                  }}
                >
                  Visualizar
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p>Nenhum material gerado ainda</p>
          </div>
        )}
      </div>
    </div>
  );
}
